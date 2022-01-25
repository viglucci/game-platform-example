const {of, delay} = require('rxjs');

class FriendsService {

    constructor() {}

    get routes() {
        return [{
            name: "FriendsService.getFriends",
            type: "REQUEST_RESPONSE",
            handle: this.getFriends.bind(this)
        }];
    }

    getFriends(data) {
        const friends = [{
            name: 'Jane Doe',
            handle: 'janedoe1234',
            href: '#',
            imageUrl:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            status: 'online',
        }];
        return of(friends)
            // artificial delay
            .pipe(delay(200));
    }
}

module.exports = FriendsService;
