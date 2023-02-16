#! usr/bin/bash
cd
pm2 stop Odin
mv Odin/config.json config.json
rm -r Odin
git clone https://github.com/tecdude/Odin.git
mv config.json Odin/config.json
cd Odin
npm install
cd
pm2 start Odin