echo "Deleting existing build folder..."
rm -rf build/
echo "Copying files to build dir"
mkdir build
cp js/*.js build
cp package.json build/
rsync -r styles build/
for y in config/*.yml
do
  echo "Converting $y to json"
  z=${y#config/}
  yaml2json "$y" > "build/${z%.yml}.json"
done
cd build
rm *.test.js
echo "Installing production deps in build"
npm install --only=production
zip -r build.zip *
cd ..
