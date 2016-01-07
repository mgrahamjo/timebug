'use strict';

let timer = {},
	tally = {},
	stack = [];

function start(id) {

	stack.push(id);

	timer[id] = timer[id] || [];

	timer[id].push(Date.now());
}

function stop(id) {

	stack.pop();

	if (!timer[id] || timer[id].length === 0) {

		console.error('Can\'t stop unstarted timer ' + id);
	
	} else {

		let start = timer[id].pop();

		tally[id] = tally[id] || {};

		tally[id].total = tally[id].total || 0;
		tally[id].count = tally[id].count || 0;

		tally[id].total += Date.now() - start;
		tally[id].count++;
	}
}

function complete() {

	console.log('-----------------------');
	console.log('        Timebug');
	
	Object.keys(tally).sort((a, b) => {
		
		return tally[b].total - tally[a].total;

	}).forEach(id => {

		let total = Math.max(tally[id].total, 0),
			count = tally[id].count,
			average = Math.ceil(total / count);

		console.log('-----------------------');
		console.log(`${id}:`);
		console.log(`    total: ${total}ms`);
		console.log(`    count: ${count}`);
		console.log(`    mean : ${average}ms`);
	});

	console.log('-----------------------');
}

function ignore(fn, args) {

	let result;

	if (stack.length === 0) {

		console.error('You can\'t ignore a function call when no timers are running.')

		result = fn.apply(null, args);

	} else {

		let start = Date.now();

		result = fn.apply(null, args);

		let delta = Date.now() - start;

		stack.forEach(id => {
			tally[id] = tally[id] || {};
			tally[id].total = tally[id].total || 0;
			tally[id].total -= delta;
		});
	}

	return result;
}

module.exports = {
	start: start,
	stop: stop,
	complete: complete,
	ignore: ignore
};