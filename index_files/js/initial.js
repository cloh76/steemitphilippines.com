 $(document).ready(function () {
      Vue.component('cards',{
        template: '#postCard',
        data: function(){
           return{
              posts:[]
           }
        },

        created: function(){
          this.getPostsInfo();
        },

        methods: {
          getPostsInfo(){
             steem.api.getDiscussionsByTrending({tag:'steemph',limit:15}, function(err, response){
              var arr = [];
              var _this = this
            //console.log(err, response);
            $.each(response, function(key, value) {
                var obj =JSON.parse(value.json_metadata);
              //  console.log(value);
                _this.GetProfileImage(value.author,function(response){
                var replies= [];
               steem.api.getContentReplies(value.author,value.permlink, function (err,resp){
                    replies.push(resp.length);
                });
              // console.log(replies)
                var payout = value.pending_payout_value.replace(' SBD','')
                arr.push({author:value.author,
                          title:value.title,
                          image:obj.image[0],
                          profileimage:response.image,
                          reputation:response.reputation,
                          votes:value.net_votes,
                          payout:payout,
                          comment_count: replies,
                          permlink:value.permlink
                        });

                });
                 
             });
              this.posts = arr;
             }.bind(this));
             
            },

          GetProfileImage(user ,fn) {
              var objd = '' ;
              var self = this;
              steem.api.getAccounts([user], function(err, response){
              var userinfo =JSON.parse(response[0].json_metadata);
             // console.log(response[0]);
              var raw = response[0].reputation;
              const isNegative = (raw < 0);
              let reputation = Math.log10(Math.abs(raw));

              reputation = Math.max(reputation - 9, 0);
              reputation *= isNegative ? -9 : 9;
              reputation += 25;
              var rep =  Math.floor(reputation);
              fn({image:userinfo.profile.cover_image,reputation:rep});
            });

             return fn;
          },






        }

      });
      new Vue({
        el: '#app'
      });





   });