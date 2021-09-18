
class FriendsService {

    constructor() {}

    get routes() {
        return [{
            name: "FriendsService.getFriends",
            handle: this.getFriends.bind(this)
        }];
    }

    getFriends({data, metadata, requestN}) {
        return new Observable((subscriber) => {
            
            const friends = [{
                id: 1,
                username: "user1"
            }];

            friends.forEach((friend) => {
                subscriber.next(friend);
            });

            return () => {
                subscription.unsubscribe();
            };
        });
    }
}

module.exports = FriendsService;
