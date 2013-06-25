Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    requires: ['Template'],
    componentCls: 'app',
    items: [
        {
            xtype: 'container',
            itemId: 'templateContainer'
        }
    ],

    launch: function() {
        Ext.create('Rally.data.WsapiDataStore', {
            model: 'Changeset',
            autoLoad: true,
            fetch: ['Revision', 'Message', 'SCMRepository', 'SCMType', 'Changes', 'Author', 'Name', 'Artifacts'],

            sorters: [{
                property: 'CreationDate',
                direction: 'DESC'
            }],
            pageSize: 20,
            listeners: {
                load: this._onChangeSetDataLoaded,
                scope: this
            }
        });
    },

    _onChangeSetDataLoaded: function(store, records) {
        var newEntry;
        var me = this;
        Ext.Array.each(records, function(record) {
            var recordData = Ext.clone(record.raw)
            var artifactStore = record.getCollection('Artifacts').load({
                fetch: ['FormattedID'],
                callback: function(artifacts, operation, success) {
                    recordData.Artifacts = artifacts;
                }
            });

            var numberChanges = record.getCollection('Changes').initialCount;
            var changesDataString = '';

            if (numberChanges > 0) {
                debugger;
                var changesStore = record.getCollection('Changes').load({
                    fetch: ['Action', 'PathAndFilename', 'Uri'],
                    callback: function(changes, operation, success) {
                        recordData.Changes = changes;
                        //debugger;

                        me.down('#templateContainer').add({
                            xtype: 'template',
                            componentCls: 'changesetContainer',
                            data: recordData
                        });
                    }
                });
                
                //if (messageLength === 3999) {
                //    for (j = 0; j < numberChanges; j++) {
                //        actionAndPath = changes[j].Action + ' ' + changes[j].PathAndFilename;
                //        for (i = actionAndPath.length - 1; i > 0; i--) {
                //            forComparison = compactMessage.replace(actionAndPath.slice(0, i), '');
                //            //looks for parts of "change.Action + ' ' + change.PathAndFilename" in compactMessage.
                //            //will only record a hit if it's at the very end of compactMessage.
                //            if (forComparison === compactMessage.slice(0, compactMessage.length - i)) {
                //                compactMessage = forComparison;
                //                breakNext = true;
                //                break;
                //            }
                //        }
                //        if (breakNext) break;
                //    }
                //}
            }


            

        }, this);
    }
});
