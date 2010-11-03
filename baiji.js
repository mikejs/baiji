$(window).ready(function() {

    Legislator = Backbone.Model.extend({});

    LegislatorStore = Backbone.Collection.extend({
        model: Legislator,
        url: 'http://openstates.sunlightlabs.com/api/v1/legislators/?apikey=sunlight9&callback=?',

        initialize: function(models, options) {
            this.url = this.url + "&state=" + options.state + "&chamber=" +
                options.chamber;
        },
        
        fetch: function(options) {
            options || (options = {});
            var collection = this;
            var success = function(resp) {
                collection.refresh(resp);
                if (options.success) options.success(collection, resp);
            };

            var error = options.error && _.bind(options.error, null, collection);
            
            Backbone.sync('read', this, success, error);
            return this;
        }
    });

    legislators = new LegislatorStore([], {state: 'tx', chamber: 'upper'});

    LegislatorView = Backbone.View.extend({
        template: _.template($("#listview-template").html()),
        
        render: function() {
            $(this.el).html(this.template({legislators: legislators}));
            this.$(".listview").listview();

            return this;
        }

    });

    view = new LegislatorView({el: $("#legislator_list > div.content")[0]});

    legislators.fetch({success: function() { view.render(); }});
});