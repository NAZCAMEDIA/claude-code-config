#!/usr/bin/env python3
"""
SOLARIA API Verification - Import Checker
Verifies that all external imports have corresponding verification documents.

Usage: python verify-imports.py /path/to/project
"""

import os
import sys
import re
from pathlib import Path
from typing import Set, Dict, List

# Standard library modules to ignore (Python)
PYTHON_STDLIB = {
    'os', 'sys', 're', 'json', 'typing', 'pathlib', 'collections',
    'datetime', 'time', 'math', 'random', 'itertools', 'functools',
    'contextlib', 'abc', 'io', 'string', 'copy', 'enum', 'dataclasses',
    'asyncio', 'concurrent', 'threading', 'multiprocessing', 'subprocess',
    'logging', 'warnings', 'traceback', 'unittest', 'pytest', 'argparse',
    'configparser', 'csv', 'xml', 'html', 'urllib', 'http', 'email',
    'hashlib', 'hmac', 'secrets', 'base64', 'binascii', 'struct',
    'sqlite3', 'shelve', 'dbm', 'gzip', 'zipfile', 'tarfile',
    'tempfile', 'shutil', 'glob', 'fnmatch', 'stat', 'fileinput',
    'socket', 'ssl', 'select', 'selectors', 'signal', 'mmap',
    'codecs', 'unicodedata', 'stringprep', 'locale', 'gettext',
    'operator', 'numbers', 'decimal', 'fractions', 'statistics',
    'array', 'weakref', 'types', 'pprint', 'reprlib', 'textwrap',
    'difflib', 'uuid', 'platform', 'ctypes', 'dis', 'inspect',
    'importlib', 'pkgutil', 'modulefinder', 'runpy', 'zipimport',
    '__future__', 'builtins', 'gc', 'atexit'
}

# Node.js built-in modules to ignore
NODE_BUILTINS = {
    'fs', 'path', 'os', 'http', 'https', 'url', 'querystring',
    'stream', 'util', 'events', 'buffer', 'crypto', 'zlib',
    'child_process', 'cluster', 'dgram', 'dns', 'net', 'tls',
    'readline', 'repl', 'vm', 'assert', 'console', 'process',
    'timers', 'string_decoder', 'punycode', 'domain', 'constants',
    'module', 'v8', 'worker_threads', 'perf_hooks', 'async_hooks',
    'inspector', 'trace_events', 'wasi'
}

# Rust standard library crates to ignore
RUST_STDLIB = {
    'std', 'core', 'alloc', 'proc_macro', 'test'
}


def extract_python_imports(filepath: Path) -> Set[str]:
    """Extract external imports from Python file."""
    imports = set()
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Match: import x, from x import y
        import_patterns = [
            r'^import\s+(\w+)',
            r'^from\s+(\w+)',
        ]

        for pattern in import_patterns:
            for match in re.finditer(pattern, content, re.MULTILINE):
                module = match.group(1)
                if module not in PYTHON_STDLIB and not module.startswith('_'):
                    imports.add(module)

    except Exception:
        pass
    return imports


def extract_node_imports(filepath: Path) -> Set[str]:
    """Extract external imports from JavaScript/TypeScript file."""
    imports = set()
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Match: import x from 'y', require('y'), import('y')
        patterns = [
            r"from\s+['\"]([^'\"./][^'\"]*)['\"]",
            r"require\s*\(\s*['\"]([^'\"./][^'\"]*)['\"]",
            r"import\s*\(\s*['\"]([^'\"./][^'\"]*)['\"]",
        ]

        for pattern in patterns:
            for match in re.finditer(pattern, content):
                module = match.group(1).split('/')[0]  # Get base package
                if module not in NODE_BUILTINS and not module.startswith('@types'):
                    imports.add(module)

    except Exception:
        pass
    return imports


def extract_rust_imports(filepath: Path) -> Set[str]:
    """Extract external imports from Rust file."""
    imports = set()
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Match: use crate_name::, extern crate
        patterns = [
            r'^use\s+(\w+)::',
            r'^extern\s+crate\s+(\w+)',
        ]

        for pattern in import_patterns:
            for match in re.finditer(pattern, content, re.MULTILINE):
                crate = match.group(1)
                if crate not in RUST_STDLIB and crate != 'crate' and crate != 'self' and crate != 'super':
                    imports.add(crate)

    except Exception:
        pass
    return imports


def find_verification_docs(project_path: Path) -> Set[str]:
    """Find existing API verification documents."""
    verified = set()

    verification_dirs = [
        project_path / 'docs' / 'api-verification',
        project_path / 'docs' / 'api-verifications',
        project_path / 'docs' / 'verified-apis',
        project_path / '.api-verification',
    ]

    for vdir in verification_dirs:
        if vdir.exists():
            for doc in vdir.glob('*.md'):
                # Extract library name from filename
                name = doc.stem.lower().replace('-', '_').replace(' ', '_')
                verified.add(name)

    return verified


def scan_project(project_path: str) -> Dict:
    """Scan project for imports and verification status."""
    path = Path(project_path)

    if not path.exists():
        print(f"Error: Path '{project_path}' does not exist")
        sys.exit(1)

    all_imports: Dict[str, Set[str]] = {}
    skip_dirs = {'node_modules', 'vendor', '.git', 'dist', 'build', 'target', '__pycache__', '.venv', 'venv'}

    # Scan Python files
    for filepath in path.rglob('*.py'):
        if any(skip in str(filepath) for skip in skip_dirs):
            continue
        imports = extract_python_imports(filepath)
        for imp in imports:
            if imp not in all_imports:
                all_imports[imp] = set()
            all_imports[imp].add(str(filepath.relative_to(path)))

    # Scan JavaScript/TypeScript files
    for ext in ['*.js', '*.ts', '*.jsx', '*.tsx', '*.mjs', '*.cjs']:
        for filepath in path.rglob(ext):
            if any(skip in str(filepath) for skip in skip_dirs):
                continue
            imports = extract_node_imports(filepath)
            for imp in imports:
                if imp not in all_imports:
                    all_imports[imp] = set()
                all_imports[imp].add(str(filepath.relative_to(path)))

    # Scan Rust files
    for filepath in path.rglob('*.rs'):
        if any(skip in str(filepath) for skip in skip_dirs):
            continue
        imports = extract_rust_imports(filepath)
        for imp in imports:
            if imp not in all_imports:
                all_imports[imp] = set()
            all_imports[imp].add(str(filepath.relative_to(path)))

    # Find verification documents
    verified = find_verification_docs(path)

    return {
        'imports': all_imports,
        'verified': verified
    }


def print_report(results: Dict):
    """Print verification status report."""
    imports = results['imports']
    verified = results['verified']

    print("\n" + "=" * 60)
    print("SOLARIA API Verification Status")
    print("=" * 60)

    verified_imports = []
    unverified_imports = []

    for imp in sorted(imports.keys()):
        normalized = imp.lower().replace('-', '_').replace(' ', '_')
        if normalized in verified or imp in verified:
            verified_imports.append(imp)
        else:
            unverified_imports.append(imp)

    print(f"\nTotal external imports: {len(imports)}")
    print(f"Verified: {len(verified_imports)}")
    print(f"Unverified: {len(unverified_imports)}")

    if verified_imports:
        print(f"\n✓ VERIFIED ({len(verified_imports)}):")
        for imp in verified_imports:
            print(f"  - {imp}")

    if unverified_imports:
        print(f"\n✗ UNVERIFIED ({len(unverified_imports)}) - Need PAT-006:")
        for imp in unverified_imports:
            files = imports[imp]
            print(f"  - {imp}")
            print(f"    Used in: {', '.join(list(files)[:3])}")
            if len(files) > 3:
                print(f"    ... and {len(files) - 3} more files")

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)

    if unverified_imports:
        print(f"\n⚠️  {len(unverified_imports)} imports need API verification!")
        print("\nTo verify an import:")
        print("1. Read the library's official documentation (20 min)")
        print("2. Create: docs/api-verification/[library-name].md")
        print("3. Document all methods you plan to use")
        print("\nRun: bash scripts/new-verification.sh [library] [version] [docs-url]")
        return 1
    else:
        print("\n✓ All imports have verification documents!")
        return 0


def main():
    if len(sys.argv) < 2:
        print("Usage: python verify-imports.py /path/to/project")
        sys.exit(1)

    project_path = sys.argv[1]
    results = scan_project(project_path)
    exit_code = print_report(results)
    sys.exit(exit_code)


if __name__ == '__main__':
    main()
