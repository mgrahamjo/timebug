# Timebug

A debugging utility for Node that allows you to find out how much time is spent running arbitrary sections of code. 

You define the sections of code to time, and timebug will print out the total time spent in each section, the number of times each section was run, and the average time for each run.

### Basic Example

```javascript
var timebug = require('timebug');

function slowFunc() {
	
	timebug.start('slowFunc');

	doSomethingComplicated();

	timebug.stop('slowFunc');
}

slowFunc();

timebug.complete();

```

Running the above logs the following to the console:

```
-----------------------
        Timebug
-----------------------
slowFunc:
    total: 25ms
    count: 1
    mean : 25ms
-----------------------
```

### Run multiple timers

```javascript
var timebug = require('timebug');

function slowFunc() {
	
	timebug.start('slowFunc');

	doSomethingComplicated();

	timebug.stop('slowFunc');
}

timebug.start('app');

slowFunc();

timebug.stop('app');

timebug.complete();

```

Running the above logs the following to the console:

```
-----------------------
        Timebug
-----------------------
app:
    total: 25ms
    count: 1
    mean : 25ms
-----------------------
slowFunc:
    total: 25ms
    count: 1
    mean : 25ms
-----------------------
```

### Ignoring child function calls

Sometimes you only care about the time it takes to run the logic of one function, and you want to ignore the time spent in other functions that it calls. Wrapping a function call in `timebug.ignore()` causes its running time to be deducted from the running time of all timers in which it is nested. The function's return value will be passed along by timebug.ignore.

```javascript
var timebug = require('timebug');

function slowFunc() {
	
	timebug.start('slowFunc');

	timebug.ignore(doSomethingComplicated, [arguments]);

	timebug.stop('slowFunc');
}

timebug.start('app');

slowFunc();

timebug.stop('app');

timebug.complete();

```

Running the above logs the following to the console:

```
-----------------------
        Timebug
-----------------------
app:
    total: 0ms
    count: 1
    mean : 0ms
-----------------------
slowFunc:
    total: 0ms
    count: 1
    mean : 0ms
-----------------------
```