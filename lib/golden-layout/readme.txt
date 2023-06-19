Starting with golden-layout verison 2.0.0 they do not provide
a bundle file any more. Therfore, I had to manually build it
and include it here. Steps to do so:

* clone 

https://github.com/golden-layout/golden-layout.git

* inside the folder run
npm install
npm run build:bundles

* copy the file
bundle/umd/golden-layout.min.js
and the files

to this directory and include them from here
