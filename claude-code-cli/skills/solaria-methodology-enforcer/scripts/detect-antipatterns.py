#!/usr/bin/env python3
"""
SOLARIA Antipattern Detector
Scans a project for potential antipatterns defined in the SOLARIA methodology.

Usage: python detect-antipatterns.py /path/to/project
"""

import os
import sys
import re
from pathlib import Path
from collections import defaultdict
from typing import List, Dict, Tuple

# File extensions to scan
CODE_EXTENSIONS = {'.js', '.ts', '.jsx', '.tsx', '.py', '.rs', '.go', '.java', '.cpp', '.c', '.rb'}

# Antipattern definitions
ANTIPATTERNS = {
    'ANTI-001': {
        'name': 'Copy-Paste Without Comprehension',
        'risk': 'HIGH',
        'markers': [
            r'// ?copied from',
            r'# ?copied from',
            r'// ?source:',
            r'# ?source:',
            r'stackoverflow\.com',
            r'from chatgpt',
            r'from copilot',
        ]
    },
    'ANTI-002': {
        'name': 'Tests as Afterthought',
        'risk': 'CRITICAL',
        'check': 'coverage_analysis'
    },
    'ANTI-003': {
        'name': 'Accumulated Technical Debt',
        'risk': 'CRITICAL',
        'markers': [
            r'\bTODO\b',
            r'\bFIXME\b',
            r'\bHACK\b',
            r'\bXXX\b',
            r'\bKLUDGE\b',
            r'temporary fix',
            r'quick fix',
            r'will fix later',
        ]
    },
    'ANTI-004': {
        'name': 'Speculation-Driven API Design',
        'risk': 'CRITICAL',
        'markers': [
            r'should have',
            r'probably has',
            r'might be',
            r'I think it',
            r'assuming',
            r'// ?untested',
            r'# ?untested',
        ]
    },
    'ANTI-005': {
        'name': 'Hidden Technical Debt',
        'risk': 'HIGH',
        'markers': [
            r'workaround',
            r'work around',
            r'dirty hack',
            r'not ideal',
            r'should be refactored',
            r'tech debt',
            r'technical debt',
        ]
    },
    'ANTI-006': {
        'name': 'Undocumented Decisions',
        'risk': 'MEDIUM',
        'check': 'adr_check'
    }
}


def scan_file(filepath: Path) -> Dict[str, List[Tuple[int, str]]]:
    """Scan a single file for antipattern markers."""
    findings = defaultdict(list)

    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except Exception as e:
        return findings

    for line_num, line in enumerate(lines, 1):
        for anti_id, anti_def in ANTIPATTERNS.items():
            if 'markers' not in anti_def:
                continue
            for marker in anti_def['markers']:
                if re.search(marker, line, re.IGNORECASE):
                    findings[anti_id].append((line_num, line.strip()[:80]))
                    break

    return findings


def check_coverage(project_path: Path) -> Dict:
    """Check for test coverage issues (ANTI-002)."""
    result = {
        'detected': False,
        'issues': [],
        'coverage': None
    }

    # Check for test directories
    test_dirs = ['tests', 'test', '__tests__', 'spec']
    has_tests = any((project_path / d).exists() for d in test_dirs)

    if not has_tests:
        result['detected'] = True
        result['issues'].append('No test directory found')

    # Check for coverage reports
    coverage_files = [
        'coverage/coverage-summary.json',
        '.coverage',
        'coverage.xml',
        'lcov.info'
    ]
    has_coverage = any((project_path / f).exists() for f in coverage_files)

    if not has_coverage:
        result['detected'] = True
        result['issues'].append('No coverage report found')

    return result


def check_adrs(project_path: Path) -> Dict:
    """Check for Architecture Decision Records (ANTI-006)."""
    result = {
        'detected': False,
        'issues': [],
        'adr_count': 0
    }

    adr_paths = [
        project_path / 'docs' / 'ADR',
        project_path / 'docs' / 'adr',
        project_path / 'ADR',
        project_path / 'adr',
        project_path / 'doc' / 'architecture' / 'decisions'
    ]

    adr_dir = None
    for path in adr_paths:
        if path.exists():
            adr_dir = path
            break

    if adr_dir is None:
        result['detected'] = True
        result['issues'].append('No ADR directory found')
    else:
        adr_files = list(adr_dir.glob('*.md'))
        result['adr_count'] = len(adr_files)
        if len(adr_files) == 0:
            result['detected'] = True
            result['issues'].append('ADR directory exists but is empty')

    return result


def scan_project(project_path: str) -> Dict:
    """Scan entire project for antipatterns."""
    path = Path(project_path)

    if not path.exists():
        print(f"Error: Path '{project_path}' does not exist")
        sys.exit(1)

    results = {anti_id: {'findings': [], 'files_affected': set()}
               for anti_id in ANTIPATTERNS}

    # Scan code files
    for ext in CODE_EXTENSIONS:
        for filepath in path.rglob(f'*{ext}'):
            # Skip node_modules, vendor, etc.
            if any(skip in str(filepath) for skip in ['node_modules', 'vendor', '.git', 'dist', 'build']):
                continue

            findings = scan_file(filepath)
            for anti_id, items in findings.items():
                results[anti_id]['findings'].extend(
                    [(str(filepath.relative_to(path)), ln, txt) for ln, txt in items]
                )
                results[anti_id]['files_affected'].add(str(filepath.relative_to(path)))

    # Special checks
    results['ANTI-002']['coverage_check'] = check_coverage(path)
    results['ANTI-006']['adr_check'] = check_adrs(path)

    return results


def print_report(results: Dict):
    """Print formatted report of findings."""
    print("\n" + "=" * 60)
    print("SOLARIA Antipattern Scan Results")
    print("=" * 60)

    total_issues = 0
    critical_count = 0

    for anti_id, data in results.items():
        anti_def = ANTIPATTERNS[anti_id]
        finding_count = len(data['findings'])

        # Check special analyses
        special_detected = False
        if 'coverage_check' in data and data['coverage_check']['detected']:
            special_detected = True
        if 'adr_check' in data and data['adr_check']['detected']:
            special_detected = True

        if finding_count > 0 or special_detected:
            total_issues += finding_count
            if anti_def['risk'] == 'CRITICAL':
                critical_count += 1

            print(f"\n{anti_id} ({anti_def['name']})")
            print(f"Risk: {anti_def['risk']}")
            print("-" * 40)

            if finding_count > 0:
                print(f"Found {finding_count} potential instances in {len(data['files_affected'])} files:")
                for filepath, line_num, text in data['findings'][:5]:
                    print(f"  - {filepath}:{line_num}")
                    print(f"    {text}")
                if finding_count > 5:
                    print(f"  ... and {finding_count - 5} more")

            if 'coverage_check' in data and data['coverage_check']['detected']:
                print("Coverage Issues:")
                for issue in data['coverage_check']['issues']:
                    print(f"  - {issue}")

            if 'adr_check' in data and data['adr_check']['detected']:
                print("ADR Issues:")
                for issue in data['adr_check']['issues']:
                    print(f"  - {issue}")

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total potential antipattern instances: {total_issues}")
    print(f"Critical antipatterns detected: {critical_count}")

    if critical_count > 0:
        print("\n⚠️  CRITICAL: Address ANTI-002, ANTI-003, or ANTI-004 immediately!")
        print("   These antipatterns significantly impact code quality.")
    elif total_issues > 0:
        print("\n⚠️  WARNING: Review detected antipatterns before proceeding.")
    else:
        print("\n✓ No antipatterns detected. Code follows SOLARIA methodology.")

    return total_issues, critical_count


def main():
    if len(sys.argv) < 2:
        print("Usage: python detect-antipatterns.py /path/to/project")
        sys.exit(1)

    project_path = sys.argv[1]
    results = scan_project(project_path)
    total, critical = print_report(results)

    # Exit with error if critical antipatterns found
    sys.exit(1 if critical > 0 else 0)


if __name__ == '__main__':
    main()
