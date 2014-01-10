iframe sample codes
------------------

### Pre-reqs

* Web server to run demos
* Ruby/Pow for Offline-hackery

### post-message

Demo provides an example of cross iframe communication and dynamic resizing
of the iframe.

_quick start_

* ```cd post-message```
* ```./bin/server.sh```

### message-channel

Demo provides an example of using MessageChannel to connect multiple iframes
together

_quick start_

* ```cd message-channel```
* ```./bin/server.sh```

### iframe-sandbox

Sample code for sandboxing iframe content using srcdoc

_quick start_

* ```cd iframe-sandbox```
* ```./bin/server.sh```

### offline-hackery

Demo provides example code around caching data offline and manipulating the
applicaiton cache using an iframe

_quick start_

* Install Pow (https://github.com/37signals/pow)
* Ruby installed with bundler
* ```cd offline-hackery```
* ```bundle install``
* ```./bin/link_to_pow```
* visit http://pacman.ofh.dev
