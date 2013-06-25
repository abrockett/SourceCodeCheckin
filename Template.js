Ext.define('Template',{
    extend: 'Ext.Component',
    alias: 'widget.template',
    cls: 'template',
    tpl: Ext.create('Ext.XTemplate', 
        '<div class="changeset">{[this.getSCMRepositoryInformation(values)]}' + 
        '  Check-in <div style=padding-left:7px;>{[this.getAuthor(values)]}' +
        '{[this.getRevision(values)]}' + '{[this.getMessage(values)]}{[this.getChangesData(values)]}</div></div>', {
            getSCMRepositoryInformation: function(values) {
                //debugger;
                return values.SCMRepository._refObjectName + ' ' + values.SCMRepository.SCMType;
            },
            getAuthor: function(values) {
                if (values.Author) {
                    return 'Author: ' + values.Author._refObjectName + '<br />';
                }
            },
            getRevision: function(values) {
                if (values.Revision) {
                    return 'Revision: ' + values.Revision + '<br />';
                }
            },
            getMessage: function(values) {
                var compactMessage = this.reduceSpaces(values.Message);
                debugger;
                var artifact;
                if (values.Revision === null) {
                    return 'Message: ' + this.formatMessage(compactMessage, artifact) + '<br /><br />';
                } //else {
                //    return 'Message: ' + compactMessage + '<br /><br />';
                //}
                else {
                    id = compactMessage.split(':')[0];
                    theRest = compactMessage.split(':')[1];
                    return 'Message: ' + '<a href="' + Rally.nav.Manager.getDetailUrl(id) + ' target="_blank">' +
                        id + '</a>:' + theRest + '<br /><br />';
                }

            },
            reduceSpaces: function(message) {
                var splitArray = message.split(' ');
                var compactString = '';
                for (var count = 0; count < splitArray.length; count++) { 
                    if (splitArray[count] !== '') {
                        compactString += splitArray[count];
                        compactString += ' ';
                    }
                }
                compactString = compactString.replace(/\s$/, '');
                return compactString;
            },
            formatMessage: function(message, artifact) {
                //debugger;
                var formattedMsg = message;
                var rallyId = artifact.FormattedID.toLowerCase();
                var matchStr = message.toLowerCase().match(rallyId);

                if (matchStr !== null) {
                    formattedMsg = message.slice(0, matchStr.index);
                    formattedMsg += '<a href=' + Rally.nav.Manager.getDetailUrl(artifact._ref, false) + 
                        ' target="_blank">' + message.slice(matchStr.index, matchStr.index + rallyId.length) + '</a>';
                    formattedMsg += message.slice(matchStr.index + rallyId.length);
                }
                return formattedMsg;
            },
            getChangesData: function(values) {
                var changesDataString = '';
                if (values.Changes.length === 0) {
                    changesDataString = 'No Files Affected';
                } else {
                    changesDataString = 'Files affected by Revision ' + values.Revision + '<br />';
                    for (var i=0; i < values.Changes.length; i++) {
                        changesDataString += values.Changes[i].data.Action + ' ' +
                            '<a href=' + values.Changes[i].data.Uri +
                            'target="_blank">' + values.Changes[i].data.PathAndFilename + '</a><br />';
                    }
                }
                return changesDataString;
            }

        }
    )
});
