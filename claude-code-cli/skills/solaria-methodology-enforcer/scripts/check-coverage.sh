#!/bin/bash
# SOLARIA Coverage Threshold Checker
# Usage: bash check-coverage.sh /path/to/project [threshold]

PROJECT_PATH="${1:-.}"
THRESHOLD="${2:-75}"

echo "SOLARIA Coverage Check"
echo "======================"
echo "Project: $PROJECT_PATH"
echo "Threshold: $THRESHOLD%"
echo ""

cd "$PROJECT_PATH"

# Detect project type and get coverage
get_coverage() {
    # Node.js projects
    if [ -f "package.json" ]; then
        if [ -f "coverage/coverage-summary.json" ]; then
            # Jest/Istanbul format
            COVERAGE=$(cat coverage/coverage-summary.json 2>/dev/null | \
                grep -o '"lines":{[^}]*"pct":[0-9.]*' | \
                grep -o '[0-9.]*$' | head -1)
            echo "$COVERAGE"
            return
        fi

        if [ -f "coverage/lcov.info" ]; then
            # LCOV format
            LINES_FOUND=$(grep -c "^DA:" coverage/lcov.info)
            LINES_HIT=$(grep "^DA:" coverage/lcov.info | grep -v ",0$" | wc -l)
            if [ "$LINES_FOUND" -gt 0 ]; then
                COVERAGE=$(echo "scale=2; $LINES_HIT * 100 / $LINES_FOUND" | bc)
                echo "$COVERAGE"
                return
            fi
        fi
    fi

    # Python projects
    if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
        if [ -f ".coverage" ]; then
            COVERAGE=$(coverage report 2>/dev/null | tail -1 | awk '{print $NF}' | tr -d '%')
            echo "$COVERAGE"
            return
        fi
    fi

    # Rust projects
    if [ -f "Cargo.toml" ]; then
        if [ -f "tarpaulin-report.json" ]; then
            COVERAGE=$(cat tarpaulin-report.json | grep -o '"coverage":[0-9.]*' | cut -d: -f2)
            echo "$COVERAGE"
            return
        fi
    fi

    # Go projects
    if [ -f "go.mod" ]; then
        if [ -f "coverage.out" ]; then
            COVERAGE=$(go tool cover -func=coverage.out 2>/dev/null | tail -1 | awk '{print $NF}' | tr -d '%')
            echo "$COVERAGE"
            return
        fi
    fi

    echo ""
}

COVERAGE=$(get_coverage)

if [ -z "$COVERAGE" ]; then
    echo "❌ No coverage report found!"
    echo ""
    echo "To generate coverage:"
    echo ""
    echo "Node.js (Jest):"
    echo "  npm test -- --coverage"
    echo ""
    echo "Python:"
    echo "  coverage run -m pytest"
    echo "  coverage report"
    echo ""
    echo "Rust:"
    echo "  cargo tarpaulin --out json"
    echo ""
    echo "Go:"
    echo "  go test -coverprofile=coverage.out ./..."
    exit 1
fi

echo "Current Coverage: $COVERAGE%"
echo ""

# Compare with threshold
RESULT=$(echo "$COVERAGE >= $THRESHOLD" | bc -l)

if [ "$RESULT" -eq 1 ]; then
    echo "✓ PASSED: Coverage ($COVERAGE%) meets threshold ($THRESHOLD%)"
    exit 0
else
    echo "✗ FAILED: Coverage ($COVERAGE%) below threshold ($THRESHOLD%)"
    DIFF=$(echo "$THRESHOLD - $COVERAGE" | bc -l)
    echo "  Need to increase coverage by ${DIFF}%"
    exit 1
fi
