if [ -d "./node_modules" ]; then
  echo "Restored node_modules from cache";
else
  echo "Fill node_modules via yarn install";
  yarn install --frozen-lockfile
fi
