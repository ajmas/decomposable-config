const { readConfig } = require('../src');
const { assert } = require('chai');


describe ('Single file JSON based configuration', () => {

    it ('Should have a single key-value', async () => {
        const config = await readConfig ('./examples/config2');
        assert(config.key1 === 'value1');
    });

});

describe ('Decomposed JSON based configuration', () => {

    it ('Should have two plugins', async () => {
        const config = await readConfig ('./examples/config1');
        assert(config.plugins && typeof config.plugins === 'object');

        const plugins = config.plugins;

        assert(plugins.plugin1);
        assert(plugins.plugin1.name === 'My First Plugin',
            'Should have a plugin with name \'My First Plugin\'');

        assert(plugins.plugin2)
        assert(plugins.plugin2.name === 'My Second Plugin',
            'Should have a plugin with name \'My Second Plugin\'');
    });
});
