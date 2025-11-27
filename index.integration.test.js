const {
    constructFlowSetFromTreeFiles,
    constructTreeFilesFromFlowSet,
    constructFlowSetFromMonolithObject,
} = require('./index');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
describe('Integration Tests', () => {
    describe('Format Switching', () => {
        let testProjectDir;
        let srcDir;
        beforeEach(() => {
            testProjectDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'test-project-'));
            srcDir = path.join(testProjectDir, 'src');
            fs.mkdirSync(srcDir);
            fs.mkdirSync(path.join(srcDir, 'tabs'));
            fs.mkdirSync(path.join(srcDir, 'config-nodes'));
            fs.mkdirSync(path.join(srcDir, 'subflows'));
        });
        afterEach(() => {
            fs.rmSync(testProjectDir, {
                recursive: true
            });
        });
        it('should switch from YAML to JSON without crashes', () => {
            const yamlTab = [{
                id: 'tab1',
                type: 'tab',
                label: 'Test Tab'
            }];
            fs.writeFileSync(
                path.join(srcDir, 'tabs/test-tab.yaml'),
                yaml.dump(yamlTab)
            );
            const initialConfig = {
                fileFormat: 'yaml',
                destinationFolder: 'src',
                tabsOrder: ['tab1'],
                monolithFilename: 'flows.json'
            };
            const flowSet = constructFlowSetFromTreeFiles(initialConfig, testProjectDir);
            const finalConfig = {
                ...initialConfig,
                fileFormat: 'json'
            };
            constructTreeFilesFromFlowSet(flowSet, finalConfig, testProjectDir);
            expect(fs.existsSync(path.join(srcDir, 'tabs/test-tab.json'))).toBe(true);
            expect(fs.existsSync(path.join(srcDir, 'tabs/test-tab.yaml'))).toBe(false);
        });
        it('should handle empty src directory when format is specified', () => {
            const config = {
                fileFormat: 'json',
                destinationFolder: 'src',
                tabsOrder: ['tab1', 'tab2'],
                monolithFilename: 'flows.json'
            };
            const result = constructFlowSetFromTreeFiles(config, testProjectDir);
            expect(result).toBeInstanceOf(Object);
            expect(result.hasOwnProperty('flows')).toBe(true);
            expect(result.flows.length).toBe(0);
        });
    });
    describe('Real-World Config Nodes', () => {
        it('should process mqtt-broker config without crashes', () => {
            const flowSet = constructFlowSetFromMonolithObject([{
                id: '634b66e78c3ac533',
                type: 'mqtt-broker',
                name: '',
                broker: 'mosquitto',
                port: 1883,
                clientid: '',
            }]);
            expect(flowSet.configNodes.get('634b66e78c3ac533').config.normalizedLabel).toBe('mqtt-broker');
        });
        it('should process influxdb config without crashes', () => {
            const flowSet = constructFlowSetFromMonolithObject([{
                id: '46021893a7d13c2f',
                type: 'influxdb',
                hostname: 'influxdb',
                name: 'Frigate Influx'
            }]);
            expect(flowSet.configNodes.get('46021893a7d13c2f').config.normalizedLabel).toBe('frigate-influx');
        });
        it('should process telegram-bot config without crashes', () => {
            const flowSet = constructFlowSetFromMonolithObject([{
                id: 'ece05e71f4ab457a',
                type: 'telegram bot',
                botname: 'TestBot',
            }]);
            expect(flowSet.configNodes.get('ece05e71f4ab457a').config.normalizedLabel).toBe('testbot');
        });
        it('should process ollama-config-server without crashes', () => {
            const flowSet = constructFlowSetFromMonolithObject([{
                id: '8095382a48fe2b8c',
                type: 'ollama-config-server',
                host: 'http://192.168.0.193',
            }]);
            expect(flowSet.configNodes.get('8095382a48fe2b8c').config.normalizedLabel).toBe('ollama-config-server');
        });
    });
});
