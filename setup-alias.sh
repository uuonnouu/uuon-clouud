#!/bin/bash

# Add CLOUUD alias to your shell

if [ -f ~/.zshrc ]; then
  # Check if alias already exists
  if grep -q "alias clouud=" ~/.zshrc; then
    echo "✅ Alias already exists in ~/.zshrc"
  else
    echo 'alias clouud="cd ~/uuon-c1ouud && ./clouud-cli"' >> ~/.zshrc
    echo "✅ Added CLOUUD alias to ~/.zshrc"
    echo ""
    echo "To activate: source ~/.zshrc"
    echo "Then just type: clouud"
  fi
else
  echo "⚠️  ~/.zshrc not found"
fi

if [ -f ~/.bashrc ]; then
  if grep -q "alias clouud=" ~/.bashrc; then
    echo "✅ Alias already exists in ~/.bashrc"
  else
    echo 'alias clouud="cd ~/uuon-c1ouud && ./clouud-cli"' >> ~/.bashrc
    echo "✅ Added CLOUUD alias to ~/.bashrc"
  fi
fi
