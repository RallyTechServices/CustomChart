# Custom Chart

[![Build Status](https://travis-ci.org/RallyCommunity/CustomChart.png?branch=master)](https://travis-ci.org/RallyCommunity/CustomChart)

This app is the chart equivalent of the Custom Board and Custom List apps.  Pick a chart type (pie, bar or column), an object type, and a field to be aggregated and gain insight into your process via the generated chart.  Use the advanced filtering control to further slice and dice your data.  The data is also exportable for more fine grained inspection.

Additionally, items can be filtered by an ancestor portfolio item. (e.g. filter Features that are ultimately children of the higher level Theme).
If placed on a page that also has a [pi-ancestor-filter-broadcaster](https://github.com/RallyTechServices/pi-ancestor-filter-broadcaster),
and filter by ancestor portfolio item is enabled, it will listen to the broadcaster for the selected ancestor or project scope.

![custom chart screenshot](images/CustomChart.png "Custom Chart Screenshot")

## Installation and Settings
The app is installed as a Custom HTML App ([see help documentation](https://help.rallydev.com/custom-html))
Once the app is installed, use the gear menu on the app panel and select "Edit App Settings". There are a few settings you can configure for each chart type.

If this app is on a Timebox Scoped page, then the appropriate timebox filter
will be applied if the Timebox is valid for the queried model.  If the Timebox
is not valid for the selected model, then the Timebox scope will be ignored.

Optionally it can respect or ignore the global project setting. This is
useful when Portfolio Items associated with a specific Milestone are not
constrained to a specific subset of the Project Hierarchy tree.

![custom chart settings screenshot](images/CustomChartSettings.png "Custom Chart Settings Screenshot")

#### Chart Type
Pick the type of chart you'd like to create.  Bar, column, and pie charts are currently supported.

#### Type
Pick the type of data to include in the chart- Defect for example.

#### Aggregate By
Pick the attribute on the previously selected type which will be used for generating the summary data for the chart.

#### Bucket By
Available for bar and column charts.  If the previously selected Aggregate By attribute is of type date this setting allows you to choose the granularity of the chart axis.  Supported values include Day, Week, Month, Quarter and Year.

#### Aggregation Type
Pick how the summary should be performed- via a simple count or by summing the plan estimates.  For charts based on Portfolio Items there are additional options based on all the rollup fields- AcceptedLeafStoryCount, LeafStoryPlanEstimateTotal, etc.

#### Stack By
Available for bar and column charts.  Pick the attribute on the previously selected type which will be used to further break down the data within each bar or column.

#### Query
In addition to the advanced filtering component in the app, you can write your own complex filter queries. [Extensive documentation](https://help.rallydev.com/grid-queries?basehost=https://rally1.rallydev.com) is available. This might be useful if you want to always limit the chart to certain complex criteria. **Note**: The special `{user}` token is supported here as well.
