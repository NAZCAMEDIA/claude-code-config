#!/bin/bash
# SOLARIA Quality Gates Checker
# Usage: bash quality-gates.sh /path/to/project [coverage_threshold]

set -e

PROJECT_PATH="${1:-.}"
COVERAGE_THRESHOLD="${2:-75}"

echo "========================================"
echo "SOLARIA Quality Gates Check"
echo "========================================"
echo "Project: $PROJECT_PATH"
echo "Coverage Threshold: $COVERAGE_THRESHOLD%"
echo "----------------------------------------"

cd "$PROJECT_PATH"

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# Function to check result
check_result() {
    local name="$1"
    local status="$2"
    local message="$3"

    if [ "$status" = "pass" ]; then
        echo "✓ $name: $message"
        ((PASS_COUNT++))
    elif [ "$status" = "warn" ]; then
        echo "⚠ $name: $message"
        ((WARN_COUNT++))
    else
        echo "✗ $name: $message"
        ((FAIL_COUNT++))
    fi
}

# Detect project type
detect_project_type() {
    if [ -f "package.json" ]; then
        echo "node"
    elif [ -f "Cargo.toml" ]; then
        echo "rust"
    elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
        echo "python"
    elif [ -f "go.mod" ]; then
        echo "go"
    else
        echo "unknown"
    fi
}

PROJECT_TYPE=$(detect_project_type)
echo "Detected project type: $PROJECT_TYPE"
echo "----------------------------------------"

# Gate 1: Tests
echo ""
echo "[Gate 1: Tests]"
case $PROJECT_TYPE in
    node)
        if npm test 2>/dev/null; then
            check_result "Tests" "pass" "All tests passing"
        else
            check_result "Tests" "fail" "Tests failing"
        fi
        ;;
    rust)
        if cargo test 2>/dev/null; then
            check_result "Tests" "pass" "All tests passing"
        else
            check_result "Tests" "fail" "Tests failing"
        fi
        ;;
    python)
        if pytest 2>/dev/null; then
            check_result "Tests" "pass" "All tests passing"
        else
            check_result "Tests" "fail" "Tests failing"
        fi
        ;;
    *)
        check_result "Tests" "warn" "Unknown project type - manual verification needed"
        ;;
esac

# Gate 2: Coverage
echo ""
echo "[Gate 2: Coverage]"
case $PROJECT_TYPE in
    node)
        if [ -f "coverage/coverage-summary.json" ]; then
            COVERAGE=$(cat coverage/coverage-summary.json | grep -o '"pct":[0-9.]*' | head -1 | cut -d: -f2)
            if (( $(echo "$COVERAGE >= $COVERAGE_THRESHOLD" | bc -l) )); then
                check_result "Coverage" "pass" "${COVERAGE}% (threshold: ${COVERAGE_THRESHOLD}%)"
            else
                check_result "Coverage" "fail" "${COVERAGE}% (threshold: ${COVERAGE_THRESHOLD}%)"
            fi
        else
            check_result "Coverage" "warn" "No coverage report found"
        fi
        ;;
    rust)
        # Assuming cargo-tarpaulin or similar
        check_result "Coverage" "warn" "Run 'cargo tarpaulin' for coverage"
        ;;
    python)
        if [ -f ".coverage" ]; then
            COVERAGE=$(coverage report | tail -1 | awk '{print $NF}' | tr -d '%')
            if (( $(echo "$COVERAGE >= $COVERAGE_THRESHOLD" | bc -l) )); then
                check_result "Coverage" "pass" "${COVERAGE}% (threshold: ${COVERAGE_THRESHOLD}%)"
            else
                check_result "Coverage" "fail" "${COVERAGE}% (threshold: ${COVERAGE_THRESHOLD}%)"
            fi
        else
            check_result "Coverage" "warn" "No coverage report found"
        fi
        ;;
    *)
        check_result "Coverage" "warn" "Unknown project type"
        ;;
esac

# Gate 3: Warnings
echo ""
echo "[Gate 3: Compiler/Linter Warnings]"
case $PROJECT_TYPE in
    node)
        LINT_ERRORS=$(npx eslint . --format json 2>/dev/null | grep -o '"errorCount":[0-9]*' | cut -d: -f2 | awk '{sum+=$1} END {print sum}')
        if [ -z "$LINT_ERRORS" ] || [ "$LINT_ERRORS" = "0" ]; then
            check_result "Linting" "pass" "No linting errors"
        else
            check_result "Linting" "fail" "$LINT_ERRORS errors found"
        fi
        ;;
    rust)
        WARNINGS=$(cargo build 2>&1 | grep -c "warning:" || echo "0")
        if [ "$WARNINGS" = "0" ]; then
            check_result "Warnings" "pass" "No compiler warnings"
        else
            check_result "Warnings" "fail" "$WARNINGS warnings found"
        fi
        ;;
    python)
        LINT_ERRORS=$(flake8 . --count 2>/dev/null | tail -1 || echo "0")
        if [ "$LINT_ERRORS" = "0" ]; then
            check_result "Linting" "pass" "No linting errors"
        else
            check_result "Linting" "fail" "$LINT_ERRORS issues found"
        fi
        ;;
    *)
        check_result "Linting" "warn" "Unknown project type"
        ;;
esac

# Gate 4: Technical Debt Markers
echo ""
echo "[Gate 4: Technical Debt]"
TODO_COUNT=$(grep -r "TODO\|FIXME\|HACK\|XXX" --include="*.{js,ts,jsx,tsx,py,rs,go}" . 2>/dev/null | wc -l | tr -d ' ')
if [ "$TODO_COUNT" = "0" ]; then
    check_result "Tech Debt" "pass" "No debt markers found"
else
    check_result "Tech Debt" "warn" "$TODO_COUNT debt markers found (TODO/FIXME/HACK)"
fi

# Gate 5: Documentation
echo ""
echo "[Gate 5: Documentation]"
if [ -f "README.md" ]; then
    check_result "README" "pass" "README.md exists"
else
    check_result "README" "fail" "README.md missing"
fi

if [ -d "docs" ]; then
    check_result "Docs Dir" "pass" "docs/ directory exists"
else
    check_result "Docs Dir" "warn" "docs/ directory missing"
fi

# Summary
echo ""
echo "========================================"
echo "SUMMARY"
echo "========================================"
echo "Passed: $PASS_COUNT"
echo "Warnings: $WARN_COUNT"
echo "Failed: $FAIL_COUNT"
echo "----------------------------------------"

if [ $FAIL_COUNT -gt 0 ]; then
    echo "STATUS: FAILED - Address failed gates before proceeding"
    exit 1
elif [ $WARN_COUNT -gt 0 ]; then
    echo "STATUS: PASSED WITH WARNINGS - Review warnings"
    exit 0
else
    echo "STATUS: ALL GATES PASSED"
    exit 0
fi
