$(window).ready(function() {

    var Legislator = Backbone.Model.extend({
        initialize: function(attributes) {
            if (!this.get('photo_url')) {
                this.set({'photo_url': 'no_photo_male.png'});
            }
        }
    });

    var LegislatorStore = Backbone.Collection.extend({
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

            var error = options.error && _.bind(options.error, null,
                                                collection);

            Backbone.sync('read', this, success, error);
            return this;
        },

        comparator: function(leg) {
            return leg.get("last_name");
        }
    });

    //var legislators = new LegislatorStore([], {state: 'tx', chamber: 'upper'});
    var legislators;

    var LegislatorView = Backbone.View.extend({
        template: _.template($("#listview-template").html()),

        render: function() {
            $(this.el).html(this.template({legislators: legislators}));
            this.$(".listview").listview();

            return this;
        }
    });

    var view = new LegislatorView({el: $("#legislator_list > div.content")[0]});

    var Workspace = Backbone.Controller.extend({
        routes: {
            "legislator_list": "legislator_list"
        },

        legislator_list: function() {
            var state = $("#select-choice-1").val();
            var chamber = $("#legislator-chamber-select").val();

            legislators = new LegislatorStore([], {
                state: state,
                chamber: chamber});
            legislators.fetch({success: function() { view.render(); }});
        }
    });

    var workspace = new Workspace();

    Backbone.history.start();
});