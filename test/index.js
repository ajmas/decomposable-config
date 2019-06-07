const { readConfig } = require('../src');

// Not real tests at this point

async function test1() {
    console.log(JSON.stringify(await readConfig('examples/config1'), null, 2));
}

async function test2() {
    console.log(JSON.stringify(await readConfig('examples/config2'), null, 2));
}

try {
    test1();
    test2();
} catch (error) {
    console.error(error);
}
