const {
    disambiguate,
    reorderTabs,
    constructFlowSetFromTreeFiles,
} = require('./index');
const fs = require('fs');
jest.mock('fs');
describe('Unit Tests', () => {
    describe('disambiguate()', () => {
        it('should handle config nodes without site property', () => {
            const flowSet = {
                configNodes: [{
                    id: 'test-mqtt',
                    type: 'mqtt-broker',
                    config: {
                        broker: 'localhost'
                    }
                }]
            };
            const result = disambiguate(flowSet, 'configNodes', 'name');
            expect(result.configNodes[0].config.normalizedLabel).toBe('mqtt-broker');
            expect(() => disambiguate(flowSet, 'configNodes', 'name')).not.toThrow();
        });
        it('should use site.name when available', () => {
            const flowSet = {
                configNodes: [{
                    id: 'test-site',
                    type: 'some-node',
                    config: {
                        site: {
                            name: 'CustomName'
                        }
                    }
                }]
            };
            const result = disambiguate(flowSet, 'configNodes', 'name');
            expect(result.configNodes[0].config.normalizedLabel).toBe('customname');
        });
        it('should fall back to type when no name properties exist', () => {
            const flowSet = {
                configNodes: [{
                    id: 'test-123',
                    type: 'custom-config',
                    config: {}
                }]
            };
            const result = disambiguate(flowSet, 'configNodes', 'name');
            expect(result.configNodes[0].config.normalizedLabel).toBe('custom-config');
        });
    });
    describe('reorderTabs()', () => {
        it('should handle missing tab IDs gracefully', () => {
            const flowConfig = [{
                id: 'tab1',
                type: 'tab',
                label: 'Tab 1'
            }, {
                id: 'tab2',
                type: 'tab',
                label: 'Tab 2'
            }];
            const reference = ['tab3', 'tab1', 'tab2'];
            expect(() => reorderTabs(flowConfig, reference)).not.toThrow();
            expect(flowConfig[0].id).toBe('tab1');
            expect(flowConfig[1].id).toBe('tab2');
        });
        it('should skip all invalid references without errors', () => {
            const flowConfig = [{
                id: 'tab1',
                type: 'tab',
                label: 'Tab 1'
            }];
            const reference = ['nonexistent1', 'nonexistent2'];
            expect(() => reorderTabs(flowConfig, reference)).not.toThrow();
            expect(flowConfig[0].id).toBe('tab1');
        });
        it('should correctly reorder when all references are valid', () => {
            const flowConfig = [{
                id: 'tab1',
                type: 'tab',
                label: 'Tab 1'
            }, {
                id: 'tab2',
                type: 'tab',
                label: 'Tab 2'
            }, {
                id: 'tab3',
                type: 'tab',
                label: 'Tab 3'
            }];
            const reference = ['tab3', 'tab1', 'tab2'];
            reorderTabs(flowConfig, reference);
            expect(flowConfig[0].id).toBe('tab3');
            expect(flowConfig[1].id).toBe('tab1');
            expect(flowConfig[2].id).toBe('tab2');
        });
    });
    describe('constructFlowSetFromTreeFiles() Directory Validation', () => {
        beforeEach(() => {
            fs.existsSync.mockClear();
            fs.readdirSync.mockClear();
            console.log = jest.fn();
        });
        it('should handle missing directories gracefully', () => {
            const config = {
                destinationFolder: 'src',
                fileFormat: 'yaml',
                tabsOrder: [],
                monolithFilename: 'flows.json'
            };
            const projectPath = '/tmp/test-project-missing';
            fs.existsSync.mockImplementation(dirPath => {
                if (dirPath.endsWith('src')) return true;
                return false;
            });
            const result = constructFlowSetFromTreeFiles(config, projectPath);
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No source files found'));
            expect(result).toBeInstanceOf(Object);
            expect(result.hasOwnProperty('flows')).toBe(true);
        });
        it('should skip empty directories without errors', () => {
            const config = {
                destinationFolder: 'src',
                fileFormat: 'yaml',
                tabsOrder: [],
                monolithFilename: 'flows.json'
            };
            const projectPath = '/tmp/test-project-empty';
            fs.existsSync.mockReturnValue(true);
            fs.readdirSync.mockReturnValue([]);
            const result = constructFlowSetFromTreeFiles(config, projectPath);
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No source files found'));
            expect(result).toBeInstanceOf(Object);
            expect(result.hasOwnProperty('flows')).toBe(true);
        });
    });
});
