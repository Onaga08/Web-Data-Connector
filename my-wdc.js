$(document).ready(function() {
    // Define the Tableau connector
    var myConnector = tableau.makeConnector();

    // Define the schema dynamically based on the data
    myConnector.getSchema = function (schemaCallback) {
        // Fetch data from the API to determine schema dynamically
        $.getJSON(apiEndpoint, function (data) {
            var schema = [];
            // Check if data is available
            if (data && data.records && data.records.length > 0) {
                // Use the first record to determine fields and data types
                var firstRecord = data.records[0];
                for (var key in firstRecord) {
                    // Determine the data type of the field
                    var dataType = tableau.dataTypeEnum.string; // Default to string
                    if (!isNaN(parseFloat(firstRecord[key]))) {
                        dataType = tableau.dataTypeEnum.float;
                    } else if (new Date(firstRecord[key]) !== "Invalid Date" && !isNaN(new Date(firstRecord[key]))) {
                        dataType = tableau.dataTypeEnum.datetime;
                    }
                    // Add field to the schema
                    schema.push({
                        id: key,
                        dataType: dataType
                    });
                }
            }
            // Callback with the dynamic schema
            schemaCallback(schema);
        });
    };

    // Define data retrieval function
    myConnector.getData = function (table, doneCallback) {
        var apiEndpoint = "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json";

        $.getJSON(apiEndpoint, function (data) {
            if (data && data.records && data.records.length > 0) {
                var formattedData = [];
                $.each(data.records, function (index, record) {
                    formattedData.push(record);
                });
                table.appendRows(formattedData);
            }
            doneCallback();
        });
    };

    // Register the connector with Tableau
    tableau.registerConnector(myConnector);

    // Event listener for submit button click
    $("#submitButton").click(function () {
        tableau.connectionName = "My Web Data Connector";
        tableau.submit();
    });
});
