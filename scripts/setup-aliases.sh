#!/bin/bash
# ECO Aliases Setup
# Adds aliases to start Claude Code with automatic ECO presentation

SHELL_RC=""

# Detect shell
if [ -n "$ZSH_VERSION" ] || [ -f ~/.zshrc ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ] || [ -f ~/.bashrc ]; then
    SHELL_RC="$HOME/.bashrc"
fi

if [ -z "$SHELL_RC" ]; then
    echo "❌ Could not detect shell configuration file"
    exit 1
fi

# Check if already installed
if grep -q "ECO - Claude Code" "$SHELL_RC" 2>/dev/null; then
    echo "✓ ECO aliases already installed in $SHELL_RC"
    exit 0
fi

# Add aliases
cat >> "$SHELL_RC" << 'EOF'

# ECO - Claude Code con presentación automática
alias eco='claude "ECO inicio"'
alias claude-eco='claude "ECO inicio"'
EOF

echo "✓ ECO aliases installed in $SHELL_RC"
echo ""
echo "Usage:"
echo "  eco          - Start Claude Code with ECO presentation"
echo "  claude-eco   - Same as above"
echo ""
echo "Run 'source $SHELL_RC' or restart your terminal to use the aliases."
