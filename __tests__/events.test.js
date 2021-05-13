const Event = require('../src/controllers/events')
const {
    v4: uuid
} = require('uuid')

describe('Events sequence', () => {

    let event
    test('event is added', () => {
        return Event.create({
            body: {
                name: "Trip to Nainital",
                imageURL: "http://some_url_to_image.com",
                userId: 'BdJNMMHPrDV4uBRt7y5t',
                userName: 'shobhit',
                simplify: true
            }
        })
        .then(d => {
            // console.log(d)
            expect(d.statusCode).toBe(200)
            expect(typeof d.eventId === 'string').toBe(true)
            expect(d.data instanceof Object).toBe(true)

            event = d
        })
    })

    test('guest member can be added', () => {
        return Event.addMembers({
            body: {
                eventId: event.eventId,
                memberId: "G-"+ uuid(), // G for guest
                memberName: "Mr Guest wala",
                isGuest: true
            }
        })
        .then(d => {
            expect(d.statusCode).toBe(200)
            expect(d.members.length).toBe(2)
        })
    })
})

test('Get Total dues summary', () => {
    return Event.getDuesSummary({
        body: {
            eventId: 'BdvNLy84fcebL8tZt5t7'
        }
    })
    .then(d => {
        expect(d.statusCode).toBe(200)
        // expect(d.)
    })
})
describe("Various Event Activity Testing",()=>{

    test("Message Activity is Added",()=>{
        return Event.addMessageActivity({
            body:{
                    eventId:"51W9qZrHxb6aEBIwmiDD",
                    userId: "BdJNMMHPrDV4uBRt7y5t",
                    newMesssage:"Added More Task to Complete"
                }
            }).then(data=>{
                expect(data.statusCode).toBe(200);
            })
    })

    test("Banner Activity is Added",()=>{
        return Event.addBannerActivity({
            body:{
                    eventId:"51W9qZrHxb6aEBIwmiDD",
                    newMesssage:"New User is Created"
                }
            }).then(data=>{
                expect(data.statusCode).toBe(200);
            })
    })
})