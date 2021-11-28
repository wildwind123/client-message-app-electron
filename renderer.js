// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


// link with main process
window.api.receive("fromMain", (data) => {
    console.info(`Received ${data} from main process`);
});

let headerEl = document.querySelector('.app-header')
headerEl.addEventListener('click', function (evt) {
    if (evt.target.id === 'app-minimize') {
        window.api.send('toMain', 'minimize')
    } else if (evt.target.id === 'app-maximize') {
        window.api.send('toMain', 'maximize')
    } else if (evt.target.id === 'app-close') {
        window.api.send('toMain', 'close')
    } else {
        console.debug(evt.target.id)
    }
}, false);
//////////////////////////////////////////



////////////////////////////////////////////////////////////////////
// Utils ///////////////////////////////////////////////////////////
let getInt = (string) => {
    var int = string.replace(/^\D+/g, '');
    return parseInt(int)
}

let getIdByQueryPattern = (pattern) => {
    let selectedElement = document.querySelector(pattern)

    if (selectedElement === null) {
        console.info('selectedItem is empty, ', pattern)
        return undefined
    }
    let id = selectedElement.id
    if (id === "") {
        console.warn('selectedItem.id is empty, ', pattern)
        return undefined
    }
    return getInt(selectedElement.id)
}

// End Utils //////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
// Logick of app //////////////////////////////////////////////////

class User {
    id = 0
    online = false
    name = 'bob'
    game = "unknown"
    icon = "icon1.jpg"
    constructor(id, online, name, game, icon) {
        this.id = id
        this.online = online
        this.name = name
        this.game = game
        if (icon !== '') {
            this.icon = icon
        }
    }
}

class Message {
    id = 0
    userId = 0
    message = ""
    constructor(id, userId, message) {
        this.id = id
        this.userId = userId
        this.message = message
    }
}

class Channel {
    id = 0
    name = "unknonw"
    /** @type {Array.<Message>} */
    channelMessages = []
    /** @type {Array.<User>} */
    channelUsers = []
    /**
    * @param {Array.<Message>} channelMessages
    * @param {Array.<User>} channelUsers
    */
    constructor(id, name, channelMessages, channelUsers) {
        this.id = id
        this.name = name
        this.channelMessages = channelMessages
        this.channelUsers = channelUsers
    }
}


class Room {
    id = 0
    name = "unknown"
    /** @type {Array.<Channel>} */
    channels = Array
    /**
     * @param {Array.<Channel>} channels
     */
    constructor(id, name, channels) {

        this.id = id
        this.name = name

        this.channels = channels
    }
}

class Server {
    id = 0
    name = "unknown"
    icon = "icon1.jpg"
    /** @type {Array.<Room>} */
    rooms = []
    lastSelectedRoomId = undefined
    lastSelectedChannelId = undefined
    /** @type {Array} room id, which was hide */
    roomsHeaderIsHide = []
    /**
     * @param {Array.<Room>} rooms
     */
    constructor(id, name, rooms, icon) {
        this.id = id
        this.name = name
        this.rooms = rooms
        this.icon = icon
    }
}

class Faker {
    #Users = [
        new User(0, true, "Bob", "Dota 2", "icon1.jpg"),
        new User(1, false, "Roman", "Cs 1.6", "icon2.jpg"),
        new User(2, false, "Enternal Envy", "Dota 2", "icon3.jpg"),
        new User(3, true, "Lisa", "Lol", "icon4.jpeg"),
        new User(4, false, "-=Doctor=-", "Wow", "icon5.jpg"),
        new User(5, true, "Ferrary", "Lol", "icon6.jpg"),
        new User(6, false, "Say))", "Need for speed", "icon7.jpg"),
        new User(7, true, "Homo_sapiens", "Battlefield", "icon8.jpg"),
        new User(8, false, "Just_Djo", "Lol", "icon9.jpg"),
        new User(9, true, "Sky", "~=XXX=~", "icon10.jpg"),
    ]

    #Messages = [
        // Server 0, room 0, ch 0
        new Message(0, 1, "amazing game !!!"),
        new Message(1, 2, "i agree !!!!"),
        new Message(2, 3, "Why not found game !!!????"),
        new Message(3, 4, "I want to eat."),
        new Message(4, 5, "I win this game !!!!"),
        new Message(5, 6, "Great, great war !!!!!"),
        // Server 1, room 0, ch 0
        new Message(6, 7, "ZzzzZZzzz"),
        new Message(7, 8, "I saw too many fault on this game"),
        new Message(8, 3, "I don't want to play."),
        new Message(9, 4, "I love this app ))"),
        new Message(10, 5, "tik tak, tik tak"),
        new Message(11, 6, "aradfm"),
    ]

    #Channels = [
        // server 0, room 0
        new Channel(0, "-rock-", [0, 3,4 ,5], [0, 1,2,3,4,5,6,7,8,9]),
        new Channel(1, "dota is evil", [], [1, 2]),
        // // server 0, room 1
        new Channel(2, "main", [], [4,5,1]),
        
        // server 2, room
        new Channel(3, "main", [6,7,8], [6,7]),
        new Channel(4, "-=avengers=-", [9,10,11], [4]),
    ]

    #Rooms = [
        new Room(0, "Dire", [0, 1]),
        new Room(1, "Radiant", [2]),
        new Room(2, "main", [3, 4]),
    ]

    #Servers = [
        new Server(0, "Dota2", [0, 1], 'server1.jpg'),
        new Server(1, "LoL", [2], 'server2.jpg'),
    ]

    /**
     *  @returns {Array.<User>} 
     */
    getUsers() {
        return this.#Users
    }

    /**
     * @returns {User} 
     */
    getUser(id) {
        return this.#Users[id]
    }

    changeUserOnline( userId ) {
        if ( this.#Users[userId] === undefined ) {
            console.warn("cant set setUserOfflineOnline, key not found on faker Users ", userId)
            return undefined
        }
        this.#Users[userId].online = !this.#Users[userId].online
        return this.#Users[userId].online
    }

    /**
   *  @returns {Array.<Message>} 
   */
    getMessages() {
        return this.#Messages
    }

    /**
     * @returns {Message} 
     */
    getMessage(id) {
        return this.#Messages[id]
    }

    /**
    * @returns {Array.<Channel>} 
    */
    getChannels() {
        return this.#Channels
    }

    /**
    * @returns {Channel} 
    */
    getChannel(id) {
        return this.#Channels[id]
    }

    /**
    * @returns {Array.<Room>} 
    */
    getRoooms() {
        return this.#Rooms
    }

    /**
    * @returns {Room} 
    */
    getRooom(id) {
        return this.#Rooms[id]
    }

    /**
    * @returns {Array.<Server>} 
    */
    getServers() {
        return this.#Servers
    }

    /**
    * @returns {Server} 
    */
    getServer(id) {
        return this.#Servers[id]
    }

    getServerRoomChannelId(serverId) {
        let response = {
            lastSelectedRoomId: undefined,
            lastSelectedChannelId: undefined
        }
        let server = this.#Servers[serverId]
        if (server === undefined) {
            console.warn('key not exist on faker Servers ', serverId)
            return response
        }
        if (server.lastSelectedRoomId !== undefined &&
            server.lastSelectedChannelId !== undefined) {
            response.lastSelectedRoomId = server.lastSelectedRoomId
            response.lastSelectedChannelId = server.lastSelectedChannelId
            return response
        }
        let defaultRoomId = server.rooms[0]
        let defaultRoom = this.#Rooms[defaultRoomId]
        if (defaultRoom === undefined) {
            response.lastSelectedRoomId = undefined
            response.lastSelectedChannelId = undefined
            return response
        }
        let defaultChannelId = defaultRoom.channels[0]
        if (defaultChannelId === undefined) {
            response.lastSelectedRoomId = undefined
            response.lastSelectedChannelId = undefined
            return response
        }
        response.lastSelectedRoomId = defaultRoomId
        response.lastSelectedChannelId = defaultChannelId
        return response
    }

    setRoomChannelId(serverId, roomId, channelId) {
        if (this.#Servers[serverId] === undefined) {
            console.warn('key not exist on faker servers ', serverId)
            return
        }
        this.#Servers[serverId].lastSelectedRoomId = roomId
        this.#Servers[serverId].lastSelectedChannelId = channelId
    }

    addNewMessage(serverId, roomId, channelId, userId, message) {
        let msgId = this.#Messages.push(undefined) - 1
        let newMsg = new Message(msgId, userId, message)
        this.#Messages[msgId] = newMsg
        if (this.#Servers[serverId] === undefined) {
            console.warn('key not exist on faker Servers', serverId)
            return NaN
        }
        if (this.#Servers[serverId].rooms.includes(roomId) === false) {
            console.warn('key not exist on faker servers, roooms ', serverId, ', ', roomId)
            return NaN
        }
        if (this.#Rooms[roomId] === undefined) {
            console.warn('key not exist on faker Rooms ', roomId)
            return NaN
        }
        if (this.#Rooms[roomId].channels.includes(channelId) === false) {
            console.warn('key not exist on faker room, channel ', roomId, channelId)
            return NaN
        }
        if (this.#Channels[channelId] === undefined) {
            console.warn('key not exist on faker channels ', channelId)
            return NaN
        }
        this.#Channels[channelId].channelMessages.unshift(msgId)
        return msgId
    }

    setRoomHide(serverId, roomId) {
        if ( this.roomExistOnServer(serverId, roomId) === false ) {
            return false
        }
        this.#Servers[serverId].roomsHeaderIsHide.push(roomId)
        return true
    }

    delRoomHide(serverId, roomId) {
        if ( this.roomExistOnServer(serverId, roomId) === false ) {
            return false
        }
        this.#Servers[serverId].roomsHeaderIsHide = this.#Servers[serverId].roomsHeaderIsHide.filter( value => value !== roomId )
        return true
    }

    roomIsHide(serverId, roomId) {
        if ( this.roomExistOnServer(serverId, roomId) === false ) {
            return false
        }
        return this.#Servers[serverId].roomsHeaderIsHide.includes(roomId)
    }

    roomExistOnServer(serverId, roomId) {
        let server = this.#Servers[serverId]
        if ( server === undefined ) {
            console.warn("can't setRoomHide, key not exist on faker Servers ", serverId)
            return false
        }
        if ( !server.rooms.includes(roomId) ) {
            console.warn("can't setRoomHide, room key not exist on faker Servers. serverId ", serverId, " roomId ", roomId)
            return false
        }

        let room = this.#Rooms[roomId]
        if ( room === undefined ) {
            console.warn("can't setRoomHide key not found on faker rooms ", roomId)
            return false
        }
        return true
    }
}
let faker = new Faker()
let lastSelectedServerId = undefined
let selectedUserId = 0
/////////////////////////////////////////////////////////////////
// Listener /////////////////////////////////////////////////////

let runListeners = () => {

    const appList = document.getElementsByClassName('app-list-header')
    function haederListener(event) {
        console.log(event)
        let target = event.target
        let style = target.parentElement.querySelector('ul').style
        let roomId = getInt(target.parentElement.id)
        if (style.display !== 'none') {
            style.display = 'none'
            target.classList.add('app-list-header-show')
            target.classList.remove('app-list-header-hide')
            faker.setRoomHide(lastSelectedServerId,roomId)
        } else {
            style.display = 'block'
            target.classList.add('app-list-header-hide')
            target.classList.remove('app-list-header-show')
            faker.delRoomHide(lastSelectedServerId, roomId)
        }

    }
    for (let key in appList) {
        if (appList[key] instanceof Node) {
            appList[key].addEventListener('click', haederListener, true)
        }
    }


    const appListChats = document.querySelectorAll('.app-list-chat')
    for (let key in appListChats) {
        if (appListChats[key] instanceof Node) {
            appListChats[key].addEventListener('click', function (event) {

                let channelId = appListChats[key].id
                let roomId = appListChats[key].parentElement.parentElement.id
                if (channelId !== "" && roomId !== "") {
                    faker.setRoomChannelId(lastSelectedServerId, getInt(roomId), getInt(channelId))
                    renderServer(lastSelectedServerId, true)
                }

            }, false)

        }
    }

    const inputEl = document.querySelector('.app-message-input').querySelector('input')
    inputEl.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            let message = event.target.value

            message = message.replace(/</g, '&lt');
            message = message.replace(/>/g, '&gt');
            if (message === '') {
                return
            }
            console.debug('enter input, value ', message)

            const { lastSelectedRoomId, lastSelectedChannelId } = faker.getServerRoomChannelId(lastSelectedServerId)
            faker.addNewMessage(
                lastSelectedServerId,
                lastSelectedRoomId,
                lastSelectedChannelId,
                selectedUserId,
                message,
            )
            renderServer(lastSelectedServerId, true)
            event.target.value = ''
        }
    })
    
    const currentUserInfoAvatarEl = document.querySelector('.app-column-chatlist-footer')?.querySelector('.app-user:not(.hide)')?.querySelector('.app-avatar')
    if ( currentUserInfoAvatarEl !== null && currentUserInfoAvatarEl !== undefined) {
        currentUserInfoAvatarEl.addEventListener('click', function(event) {
            console.debug('currentUserInfoAvatarEl click', event)
            let userId = getInt(event.target.parentElement.id)
            
            faker.changeUserOnline(userId)
            renderServer(lastSelectedServerId, true)
        })
    } else {
        console.error('currentUserInfoAvatarEl not found')
    }
  

    const usersInfoEl = document.querySelector('#app-list-root-right')?.querySelectorAll('.app-user-info-three:not(.hide)')
    if ( usersInfoEl !== undefined && usersInfoEl !== null ) {
        usersInfoEl.forEach((el) => {
           el.querySelectorAll('.app-user')?.forEach(
               (element) => {
                    element.addEventListener('click', (event) => {
                        let userId = getInt(event.currentTarget.parentElement.id)
                        if ( selectedUserId !== userId && userId !== NaN ) {
                            selectedUserId = userId
                            renderServer(lastSelectedServerId, true)
                        }
                        
                    })
               }
           )
            
        })
    } else {
        console.debug('app-user-info-three is empty')
    }
}



// END Listener /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/**
 * @param {Server} server 
 */
const renderServer = (id, force) => {
    if (lastSelectedServerId === id && (force === false || force === undefined)) {
        console.log('server already rendered ', id)
        return
    }
    
    lastSelectedServerId = id

    clearServer()
    let server = faker.getServer(id)
    if (server === undefined) {
        console.warn('key not exist on faker Servers ', id)
        return
    }
    console.debug("server", server)

    renderCurrentUserInfo(selectedUserId)
    // let serverName = server.name
    // let rooms = Object;
    // let messages = []
    // let onlineUsers = []
    // let offlineUsers = []
    console.log('render-serve ----')
    // prepare items 
    for (let keyRoom in server.rooms) {
        if (typeof server.rooms[keyRoom] === "number") {
            let room = faker.getRooom(server.rooms[keyRoom])
            if (room === undefined) {
                console.warn('key on faker.Room not exist ', server.rooms[keyRoom])
                continue
            }

            renderRoom(server.rooms[keyRoom])
        }
    }

    

    // currentRooms = rooms

    // for (let roomKey in currentRooms) {
    //     console.debug("room added", "roomName = ", roomKey, "channel = ", currentRooms[roomKey])
    // }

    // render name of server
    let serverNameElement = document.querySelector('.app-column-chatlist-header')
    serverNameElement.firstElementChild.innerHTML = server.name

    // render server image active
    let serverAvatarNode = document.querySelector('#app-avatar-' + server.id)
    if (serverAvatarNode === null) {
        console.error('serverAvatarNode not found')
    } else {
        serverAvatarNode.classList.add('app-avatar-active')
    }

    // Render selected view of channel
    const { lastSelectedRoomId, lastSelectedChannelId } = faker.getServerRoomChannelId(id)
    renderChannel(lastSelectedRoomId, lastSelectedChannelId)
    runListeners()
}

/**
    * @param {Array.<Channel>} channels
    */
let renderRoom = (roomId) => {
    let room = faker.getRooom(roomId)

    if (room === undefined) {
        console.warn("roomId not exist on faker.Room ", roomId)
        return
    }
    console.log('room--', room)
    let template = document.querySelector('.app-list-template')
    let parent = template.parentElement
    let newElementRoom = template.cloneNode(true)
    let li = newElementRoom.querySelector('ul>li')
    newElementRoom.querySelector('.app-list-header').innerHTML = room.name
    newElementRoom.id = "room-id-" + room.id
    if ( faker.roomIsHide(lastSelectedServerId, room.id) === true ) {
        newElementRoom.querySelector('.app-list-header').classList.remove('app-list-header-hide')
        newElementRoom.querySelector('.app-list-header').classList.add('app-list-header-show')
        newElementRoom.querySelector('ul').style.display = 'none'
    }

    for (let roomKey in room.channels) {
        let newChannel;
        if (typeof room.channels[roomKey] === "number") {
            // console.log("room.channels ", room.channels[roomKey])
            let channel = faker.getChannel(room.channels[roomKey])
            if (channel === undefined) {
                console.warn("channelId not exist on faker.Channel")
                continue
            }

            newChannel = li.cloneNode(true)
            li.remove()
            newChannel.id = "channel-id-" + channel.id
            newChannel.innerHTML = channel.name
            // console.log(newChannel)
            let ul = newElementRoom.querySelector('ul')
            ul.appendChild(newChannel)
        }
    }
    newElementRoom.classList.remove('app-list-template')
    parent.appendChild(newElementRoom)

}

let getSelectedServerId = () => {
    let chatId = getIdByQueryPattern('.app-list-chat.app-list-selected')

    if (selectedElement === null) {
        console.info('selectedItem is empty')
        return undefined
    }
    let id = selectedElement.id
    if (id === "") {
        console.warn('selectedItem.id is empty')
        return undefined
    }
    return getInt(selectedElement.id)
}

let renderServerImages = () => {

    // render server image
    let renderServerImage = (server) => {
        let existAvatarElements = document.getElementsByClassName('app-avatar')
        for (let keyAvatar in existAvatarElements) {
            if (existAvatarElements[keyAvatar] instanceof Node) {

                if (existAvatarElements[keyAvatar].id !== "" && parseInt(existAvatarElements[keyAvatar].id) === server.id) {
                    console.debug('avatar already rendered ', server.id, existAvatarElements[keyAvatar].id)
                    return
                }
            }
        }

        let template = document.querySelector('.app-avatar.hide')
        let newServerIconElement = template.cloneNode(true)
        newServerIconElement.classList.remove('hide')
        newServerIconElement.setAttribute('title', server.name)
        newServerIconElement.style.backgroundImage = "url('style/css/" + server.icon + "')"
        newServerIconElement.id = 'app-avatar-' + server.id
        newServerIconElement.addEventListener('click', function (event) {
            if (lastSelectedServerId === parseInt(event.target.id)) {
                return
            }
            renderServer(server.id)
        })
        template.parentElement.appendChild(newServerIconElement)
    }

    let servers = faker.getServers()
    for (let serverKey in servers) {
        renderServerImage(servers[serverKey])
    }
}

let clearChannels = () => {

    let channelElements = document.querySelectorAll('#app-list-root>.app-list:not(.app-list-template)')

    for (let key in channelElements) {
        if (channelElements[key] instanceof Node) {
            channelElements[key].remove()
        }
    }
}

let clearUserList = () => {
    let nodes = document.getElementById('app-list-root-right').querySelectorAll('.app-list:not(.hide)')
    if (nodes === null) {
        console.info('right user column items is empty')
        return
    }
    for (let key in nodes) {
        if (nodes[key] instanceof Node) {
            nodes[key].remove()
        }
    }
}

let clearMessages = () => {

    let channelElements = document.querySelectorAll('.app-column-chat-message:not(.template)')

    for (let key in channelElements) {
        if (channelElements[key] instanceof Node) {
            channelElements[key].remove()
        }
    }
}

let renderMessage = (id) => {
    let message = faker.getMessage(id)
    if (message === undefined) {
        console.warn('key not exist on faker Messages ', id)
        return
    }
    let templateEl = document.querySelector('.app-column-chat-message.template')
    let newMessageEl = templateEl.cloneNode(true)
    newMessageEl.style.display = 'flex'
    newMessageEl.classList.remove('template')
    newMessageEl.id = message.id
    let user = faker.getUser(message.userId)
    if (user === undefined) {
        console.warn('key not exist on faker User ', key)
    }
    let avatar = newMessageEl.querySelector('.app-avatar')
    avatar.style.backgroundImage = "url('style/css/" + user?.icon + "')"
    newMessageEl.querySelector('.app-column-chat-message-username').innerHTML = user?.name
    newMessageEl.querySelector('.app-column-chat-message-text').innerHTML = message.message
    if ( user.id === selectedUserId) {
        newMessageEl.classList.add('app-current-user')
    }
    avatar.classList.remove('app-avatar-online')
    avatar.classList.remove('app-avatar-offline')
    if (user?.online === true) {
        avatar.classList.add('app-avatar-online')
    } else {
        avatar.classList.add('app-avatar-offline')
    }
    templateEl.parentElement.appendChild(newMessageEl)
}

let renderEffectChannelSelected = (roomId, channelId) => {
    let selectedList = document.querySelector('.app-room').querySelectorAll('.app-list-selected');
    if (selectedList === null) {
        console.debug("selected list not found")
    } else {
        for (let key in selectedList) {
            if (selectedList[key] instanceof Node) {
                selectedList[key].classList.remove('app-list-selected')
            }
        }
    }
    let roomIdEl = document.getElementById('room-id-' + roomId)
    if (roomIdEl === null) {
        console.warn('room id does not exist ', roomId)
    } else {
        roomIdEl.querySelector('.app-list-header').classList.add('app-list-selected')
        let channelEl = roomIdEl.querySelector('#channel-id-' + channelId)
        if (channelEl === null) {
            console.warn('channel id does not exist')
        } else {
            channelEl.classList.add('app-list-selected')
        }
    }


}

let renderChannel = (roomId, channelId) => {
    let room = faker.getRooom(roomId)
    if (room === undefined) {
        console.warn('key not exist on faker Rooms ', roomId)
        return
    }
    if (!room.channels.includes(channelId)) {
        console.warn('channed id does not exist on faker room, id channel', channelId, ' roomID', roomId)
        return
    }

    let channel = faker.getChannel(channelId)
    if (channel === undefined) {
        console.warn('key not exist on faker Channel ', id)
        return
    }
    faker.setRoomChannelId(lastSelectedServerId, roomId, channelId)
    console.debug('this channel will rendiring ', channel)
    let channelHeaderEl = document.querySelector('.app-column-channel-name ')
    channelHeaderEl.innerHTML = channel.name

    clearMessages()
    clearUsersInfo()
    for (let channelKey in channel.channelMessages) {
        if (typeof channel.channelMessages[channelKey] === 'number') {
            let message = faker.getMessage(channel.channelMessages[channelKey])
            if (message === undefined) {
                console.warn('key not exist on faker Message ', channel.channelMessages[channelKey])
                continue
            }
            renderMessage(channel.channelMessages[channelKey])
        }
    }
    renderUsersInfo(channel.channelUsers)
    renderEffectChannelSelected(roomId, channelId)

}

let renderCurrentUserInfo = (userId) => {
    let user = faker.getUser(userId)
    if ( user === undefined ) {
        console.error("can't find key of current user on faker Users ", userId)
        return
    }
    let template =  document.querySelector('.app-column-chatlist-footer>.app-user')
    let currentUserEl = template.cloneNode(true)
    currentUserEl.id = "current-user-id-" + user.id
    currentUserEl.querySelector('.app-username').innerHTML = user.name
    currentUserEl.querySelector('.app-user-info-text').innerHTML = 'ID: ' + user.id
    currentUserEl.querySelector('.app-avatar').style.backgroundImage = "url('style/css/" + user.icon + "')"
    if ( user.online === false ) {
        currentUserEl.querySelector('.app-avatar').classList.remove('app-avatar-online')
        currentUserEl.querySelector('.app-avatar').classList.add('app-avatar-offline')
    } else {
        currentUserEl.querySelector('.app-avatar').classList.remove('app-avatar-offline')
        currentUserEl.querySelector('.app-avatar').classList.add('app-avatar-online')
    }
    currentUserEl.classList.remove('hide')
    template.parentElement.appendChild(currentUserEl)
}

let renderUsersInfo = (userIds) => {
    let template = document.querySelector('.app-user-info-three.hide')
    if (template === null) {
        console.error('user info template not exist')
        return
    }

    var userList = {}

    if ( !userIds.includes(selectedUserId) ) {
        userIds.push(selectedUserId)
    }

    // Sort online, offline users
    for (let userId in userIds) {
        let user = faker.getUser(userIds[userId])
        if (user === null) {
            console.warn('key not exist on faker Users ', userId)
            continue
        }
        if (user.online == true) {
            if (userList['online'] === undefined) {
                userList['online'] = []
            }
            userList['online'].push(user)
        } else {
            if (userList['offline'] === undefined) {
                userList['offline'] = []
            }
            userList['offline'].push(user)
        }
    }
    console.debug('users info list', userList['online'], userList['offline'])
    // Render online users
    let renderUsers = (header, users) => {
        let nemOnlineEl = template.cloneNode(true)
        let listRoot = nemOnlineEl.querySelector('.app-user-info-list')
        let userInfoTemplate = nemOnlineEl.querySelector('.app-user-info-root').cloneNode(true)
        
        nemOnlineEl.querySelector('.app-user-info-root').remove()
        nemOnlineEl.classList.remove('hide')

        nemOnlineEl.querySelector('.app-user-info-header').innerHTML = header


        for (let userKey in users) {
            let newUserInfo = userInfoTemplate.cloneNode(true)
            let avatar = newUserInfo.querySelector('.app-avatar')
            let user = users[userKey]
            if ( user.id === selectedUserId ) {
                newUserInfo.querySelector('.app-user').classList.add('app-current-user')
            }
            newUserInfo.querySelector('.app-user-info-text-name').innerHTML = user.name
            newUserInfo.id = 'user-info-' + user.id
            avatar.style.backgroundImage = "url('style/css/" + user.icon + "')"
            avatar.classList.remove('app-avatar-online')
            avatar.classList.remove('app-avatar-offline')
            if (user.online === true) {
                newUserInfo.querySelector('.app-user-info-text').innerHTML = user.game
                avatar.classList.add('app-avatar-online')
            } else {
                newUserInfo.querySelector('.app-user-info-text').innerHTML = ''
                avatar.classList.add('app-avatar-offline')
            }
            
            listRoot.appendChild(newUserInfo)
        }
        nemOnlineEl.appendChild(listRoot)
        template.parentElement.appendChild(nemOnlineEl)
    }
    if (userList['online'] !== undefined) {
        renderUsers('Online', userList['online'])
    }
    if (userList['offline'] !== undefined) {
        renderUsers('Offline', userList['offline'])
    }


}

let clearServerImages = () => {
    let images = document.querySelector('.app-column-servers').querySelectorAll('.app-avatar:not(.hide)')
    if (images === null) {
        console.warn('server images not set')
        return
    }
    for (let key in images) {
        if (images[key] instanceof Node) {
            images[key].classList.remove('app-avatar-active')
        }
    }
}

let clearUsersInfo = () => {
    let userLists = document.querySelector('#app-list-root-right').querySelectorAll('.app-user-info-three:not(.hide)')
    for (let key in userLists) {
        if (userLists[key] instanceof Node) {
            userLists[key].remove()
        }
    }
}



let clearServer = () => {
    document.querySelector('.app-column-channel-name').innerHTML = '';
    document.querySelector('.app-column-chatlist-footer')?.querySelector('.app-user:not(.hide)')?.remove()
    clearChannels()
    clearMessages()
    clearServerImages()
    clearUsersInfo()
}

renderServerImages()
renderServer(0)

// renderServerImage(0)


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////