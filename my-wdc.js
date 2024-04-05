$(document).ready(function() {
    // Define connector
    var myConnector = tableau.makeConnector();

    // Define schema
    myConnector.getSchema = function (schemaCallback) {
        // Define schema here
        var schema = [];
        // Add fields to schema
        schema.push({
            id: "example_field_1",
            dataType: tableau.dataTypeEnum.string
        });
        schema.push({
            id: "example_field_2",
            dataType: tableau.dataTypeEnum.float
        });
        // Call schemaCallback with the schema
        schemaCallback(schema);
    };

    // Define data retrieval function
    myConnector.getData = function (table, doneCallback) {
        // Retrieve data from API and format it
        var apiEndpoint = "https://api.data.gov.in/resource/cbfeb319-56a4-4fb3-9d88-8cbae69e4662?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json";
        
        // Make API request
        $.getJSON(apiEndpoint, function (data) {
            // Format data properly
            var formattedData = [];
            $.each(data.records, function (index, record) {
                var formattedRecord = {
                    "example_field_1": record.example_field_1,
                    "example_field_2": parseFloat(record.example_field_2)
                };
                formattedData.push(formattedRecord);
            });
            // Pass data to Tableau
            table.appendRows(formattedData);
            doneCallback();
        });
    };

    // Register connector with Tableau
    tableau.registerConnector(myConnector);

    // Initiate connector
    $("#submitButton").click(function () {
        tableau.connectionName = "My Web Data Connector";
        tableau.submit();
    });
});
