#!/usr/local/bin/python

import zerorpc

class HelloRPC(object):
    def hello(self, name):
        return "Hello, %s" % name

s = zerorpc.Server(HelloRPC())
s.bind("tcp://127.0.0.1:4242")
s.run()