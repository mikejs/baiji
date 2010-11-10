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
            this.state = options.state;
            this.chamber = options.chamber;
        },

        fetch: function(options) {
            var cache_key = "LegislatorStore-" + this.state + "-" + this.chamber;
            var cached = localStorage.getItem(cache_key);
            if (cached) {
                cached = $.parseJSON(cached);
                this.refresh(cached);
                if (options.success) options.success(this, cached);
                return this;
            }

            options || (options = {});
            var collection = this;
            var success = function(resp) {
                localStorage.setItem(cache_key, JSON.stringify(resp));
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