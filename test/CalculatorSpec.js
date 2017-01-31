describe('Calculator', function() {

    describe('with defects', function() {

        var data, store;

        function expectChartDataToBe(chartData, expectedSeriesData) {
            expect(chartData.categories).toEqual(['P1', 'P2', 'P3', 'P4']);
            expect(chartData.series.length).toBe(1);
            var seriesData = chartData.series[0];
            expect(seriesData.name).toBe('Priority');
            expect(seriesData.data).toEqual(expectedSeriesData);
        }

        beforeEach(function() {
            var model = Rally.test.Mock.dataFactory.getModel('defect');
            data = Rally.test.Mock.dataFactory.getRecords('defect', {
                count: 4,
                values: [
                    { Priority: 'P1', PlanEstimate: 2, Owner: null, c_KanbanState: '', Tags: { _tagsNameArray: [] } },
                    { Priority: 'P2', PlanEstimate: 3, Owner: { _refObjectName: 'User1' }, c_KanbanState: 'Building', Tags: { _tagsNameArray: [{ Name: 'Foo' }, { Name: 'Bar' }] } },
                    { Priority: 'P3', PlanEstimate: 4, Owner: { _refObjectName: 'User2' }, c_KanbanState: 'Testing', Tags: { _tagsNameArray: [{ Name: 'Bar' }, { Name: 'Baz' }] } },
                    { Priority: 'P4', PlanEstimate: 5, Owner: { _refObjectName: 'User3' }, c_KanbanState: 'Done',  Tags: { _tagsNameArray: [{ Name: 'Baz' }] } }
                ]
            });
            store = Ext.create('Rally.data.wsapi.Store', {
              model: model,
              data: data
            });
        });

        it('should aggregate by count', function() {
            var calculator = Ext.create('Calculator', {
                field: 'Priority',
                calculationType: 'count'
            });
            var chartData = calculator.prepareChartData(store);
            expectChartDataToBe(chartData, [['P1', 1], ['P2', 1], ['P3', 1], ['P4', 1]]);
        });

        it('should aggregate by plan estimate', function() {
            var calculator = Ext.create('Calculator', {
                field: 'Priority',
                calculationType: 'estimate'
            });
            var chartData = calculator.prepareChartData(store);
            expectChartDataToBe(chartData, [['P1', 2], ['P2', 3], ['P3', 4], ['P4', 5]]);
        });

        it('should bucket by object type', function() {
            var calculator = Ext.create('Calculator', {
                field: 'Owner',
                calculationType: 'count'
            });
            var chartData = calculator.prepareChartData(store);
            expect(chartData.categories).toEqual(['-- No Owner --', 'User1', 'User2', 'User3']);
        });

        it('should bucket by custom field type', function() {
            var calculator = Ext.create('Calculator', {
                field: 'c_KanbanState',
                calculationType: 'estimate'
            });
            var chartData = calculator.prepareChartData(store);
            expect(chartData.categories).toEqual(['-- No Entry --', 'Building', 'Testing', 'Done']);
        });

        it('should aggregate by collection field', function() {
            var calculator = Ext.create('Calculator', {
                field: 'Tags',
                calculationType: 'estimate'
            });
            var chartData = calculator.prepareChartData(store);
            expect(chartData.categories).toEqual(['None', 'Foo', 'Bar', 'Baz']);
            var seriesData = chartData.series[0];
            expect(seriesData.name).toBe('Tags');
            expect(seriesData.data).toEqual([['None', 2], ['Foo', 3], ['Bar', 7], ['Baz', 9]]);
        });
    });

    describe('with features', function() {

        var data, store;

        function expectChartDataToBe(chartData, expectedSeriesData) {
            expect(chartData.categories).toEqual(['UX', 'Maintenance', 'Product Roadmap', 'Architecture Roadmap']);
            expect(chartData.series.length).toBe(1);
            var seriesData = chartData.series[0];
            expect(seriesData.name).toBe('InvestmentCategory');
            expect(seriesData.data).toEqual(expectedSeriesData);
        }

        beforeEach(function() {
            var model = Rally.test.Mock.dataFactory.getModel('portfolioitem/feature');
            data = Rally.test.Mock.dataFactory.getRecords('portfolioitem/feature', {
                count: 4,
                values: [
                    { InvestmentCategory: 'UX', PreliminaryEstimateValue: 2, Parent: null, AcceptedLeafStoryCount: 3, AcceptedLeafStoryPlanEstimateTotal: 4, LeafStoryCount: 5, LeafStoryPlanEstimateTotal: 6 },
                    { InvestmentCategory: 'Maintenance', PreliminaryEstimateValue: 3, Parent: { _refObjectName: 'Initiative1' }, AcceptedLeafStoryCount: 4, AcceptedLeafStoryPlanEstimateTotal: 5, LeafStoryCount: 6, LeafStoryPlanEstimateTotal: 7 },
                    { InvestmentCategory: 'Product Roadmap', PreliminaryEstimateValue: 4, Parent: { _refObjectName: 'Initiative2' }, AcceptedLeafStoryCount: 5, AcceptedLeafStoryPlanEstimateTotal: 6, LeafStoryCount: 7, LeafStoryPlanEstimateTotal: 8 },
                    { InvestmentCategory: 'Architecture Roadmap', PreliminaryEstimateValue: 5, Parent: { _refObjectName: 'Initiative3' }, AcceptedLeafStoryCount: 6, AcceptedLeafStoryPlanEstimateTotal: 7, LeafStoryCount: 8, LeafStoryPlanEstimateTotal: 9 }
                ]
            });
            store = Ext.create('Rally.data.wsapi.Store', {
              model: model,
              data: data
            });
        });

        it('should aggregate by count', function() {
            var calculator = Ext.create('Calculator', {
                field: 'InvestmentCategory',
                calculationType: 'count'
            });
            var chartData = calculator.prepareChartData(store);
            expectChartDataToBe(chartData, [['UX', 1], ['Maintenance', 1], ['Product Roadmap', 1], ['Architecture Roadmap', 1]]);
        });

        it('should aggregate by preliminary estimate', function() {
          var calculator = Ext.create('Calculator', {
              field: 'InvestmentCategory',
              calculationType: 'prelimest'
          });
          var chartData = calculator.prepareChartData(store);
          expectChartDataToBe(chartData, [['UX', 2], ['Maintenance', 3], ['Product Roadmap', 4], ['Architecture Roadmap', 5]]);
        });

        it('should aggregate by accepted leaf count', function() {
          var calculator = Ext.create('Calculator', {
              field: 'InvestmentCategory',
              calculationType: 'acceptedleafcount'
          });
          var chartData = calculator.prepareChartData(store);
          expectChartDataToBe(chartData, [['UX', 3], ['Maintenance', 4], ['Product Roadmap', 5], ['Architecture Roadmap', 6]]);
        });

        it('should aggregate by accepted leaf story plan estimate total', function() {
          var calculator = Ext.create('Calculator', {
              field: 'InvestmentCategory',
              calculationType: 'acceptedleafplanest'
          });
          var chartData = calculator.prepareChartData(store);
          expectChartDataToBe(chartData, [['UX', 4], ['Maintenance', 5], ['Product Roadmap', 6], ['Architecture Roadmap', 7]]);
        });

        it('should aggregate by leaf story count', function() {
          var calculator = Ext.create('Calculator', {
              field: 'InvestmentCategory',
              calculationType: 'leafcount'
          });
          var chartData = calculator.prepareChartData(store);
          expectChartDataToBe(chartData, [['UX', 5], ['Maintenance', 6], ['Product Roadmap', 7], ['Architecture Roadmap', 8]]);
        });

        it('should aggregate by leaf story plan estimate total', function() {
          var calculator = Ext.create('Calculator', {
              field: 'InvestmentCategory',
              calculationType: 'leafplanest'
          });
          var chartData = calculator.prepareChartData(store);
          expectChartDataToBe(chartData, [['UX', 6], ['Maintenance', 7], ['Product Roadmap', 8], ['Architecture Roadmap', 9]]);
        });

        it('should bucket by object type', function() {
            var calculator = Ext.create('Calculator', {
                field: 'Parent',
                calculationType: 'count'
            });
            var chartData = calculator.prepareChartData(store);
            expect(chartData.categories).toEqual(['None', 'Initiative1', 'Initiative2', 'Initiative3']);
        });
    });

    describe('with stacking', function() {

        var data, store;

        function expectChartDataToBe(chartData, expectedSeriesData) {
            expect(chartData.categories).toEqual(['None', 'P1', 'P2', 'P3']);
            expect(chartData.series).toEqual(expectedSeriesData);
        }

        beforeEach(function() {
            var model = Rally.test.Mock.dataFactory.getModel('defect');
            data = Rally.test.Mock.dataFactory.getRecords('defect', {
                count: 5,
                values: [
                    { Priority: '', Severity: 'S1', PlanEstimate: 2, Owner: null },
                    { Priority: 'P1', Severity: 'S2', PlanEstimate: 3, Owner: { _refObjectName: 'User1' } },
                    { Priority: 'P2', Severity: 'S3', PlanEstimate: 4, Owner: { _refObjectName: 'User2' } },
                    { Priority: 'P3', Severity: '', PlanEstimate: 5, Owner: { _refObjectName: 'User3' } },
                    { Priority: 'P3', Severity: '', PlanEstimate: 6, Owner: { _refObjectName: 'User3' } }
                ]
            });
            store = Ext.create('Rally.data.wsapi.Store', {
              model: model,
              data: data
            });
        });

         it('should aggregate by count with stack values', function() {
            var calculator = Ext.create('BarCalculator', {
                field: 'Priority',
                stackField: 'Severity',
                stackValues: ['', 'S1', 'S2', 'S3', 'S4'],
                calculationType: 'count'
            });
            var chartData = calculator.prepareChartData(store);
            expectChartDataToBe(chartData, [ 
                { name: 'None', type: 'bar', data: [ 0, 0, 0, 2 ] }, 
                { name: 'S1', type: 'bar', data: [ 1, 0, 0, 0 ] }, 
                { name: 'S2', type: 'bar', data: [ 0, 1, 0, 0 ] }, 
                { name: 'S3', type: 'bar', data: [ 0, 0, 1, 0 ] }, 
                { name: 'S4', type: 'bar', data: [ 0, 0, 0, 0 ] }
            ]);
        });

        it('should aggregate by estimate with stack values', function() {
            var calculator = Ext.create('BarCalculator', {
                field: 'Priority',
                stackField: 'Severity',
                stackValues: ['', 'S1', 'S2', 'S3', 'S4'],
                calculationType: 'estimate'
            });
            var chartData = calculator.prepareChartData(store);
            expectChartDataToBe(chartData, [ 
                { name: 'None', type: 'bar', data: [ 0, 0, 0, 11 ] }, 
                { name: 'S1', type: 'bar', data: [ 2, 0, 0, 0 ] }, 
                { name: 'S2', type: 'bar', data: [ 0, 3, 0, 0 ] }, 
                { name: 'S3', type: 'bar', data: [ 0, 0, 4, 0 ] }, 
                { name: 'S4', type: 'bar', data: [ 0, 0, 0, 0 ] }
            ]);
        });

         it('should aggregate by count with no stack values', function() {
            var calculator = Ext.create('ColumnCalculator', {
                field: 'Priority',
                stackField: 'Owner',
                calculationType: 'count'
            });
            var chartData = calculator.prepareChartData(store);
            expectChartDataToBe(chartData, [ 
                { name: '-- No Owner --', type: 'column', data: [ 1, 0, 0, 0 ] }, 
                { name: 'User1', type: 'column', data: [ 0, 1, 0, 0 ] }, 
                { name: 'User2', type: 'column', data: [ 0, 0, 1, 0 ] }, 
                { name: 'User3', type: 'column', data: [ 0, 0, 0, 2 ] }
            ]);
        });

         it('should aggregate by estimate with no stack values', function() {
            var calculator = Ext.create('ColumnCalculator', {
                field: 'Priority',
                stackField: 'Owner',
                calculationType: 'estimate'
            });
            var chartData = calculator.prepareChartData(store);
            expectChartDataToBe(chartData, [ 
                { name: '-- No Owner --', type: 'column', data: [ 2, 0, 0, 0 ] }, 
                { name: 'User1', type: 'column', data: [ 0, 3, 0, 0 ] }, 
                { name: 'User2', type: 'column', data: [ 0, 0, 4, 0 ] }, 
                { name: 'User3', type: 'column', data: [ 0, 0, 0, 11 ] }
            ]);
        });
    });
});
