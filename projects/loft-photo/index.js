import photosDB from './photos.json';
import friendsDB from './friends.json';

function getRandomElement(array) {
    if (!Array.isArray(array) || array.length == 0) {
        throw new Error('empty array')
    }
    const rand = parseInt(Math.random() * array.length);
    return array[rand]
};
function getNextPhoto() {
    if (friendsDB.length == 0) {
        throw new Error('You have 0 friend :(')
    }
    const randFriend = parseInt(Math.random() * friendsDB.length);
    const friend = friendsDB[randFriend];
    const firstName = friend.firstName;
    const id = friend.id;
    const randPhoto = parseInt(Math.random() * photosDB[id].length)
    const photosValue = photosDB[id].length
    return {
        friend: firstName,
        url: (photosValue !== 0) ? photosDB[id][randPhoto].url : 'user photo not found'
    }
};

try {
    const user = getNextPhoto();
    console.log(user.friend);
    console.log(user.url)
    console.log(getRandomElement(['apple', 'pineapple', 'banan']))
} catch (e) {
    console.error(e)
}