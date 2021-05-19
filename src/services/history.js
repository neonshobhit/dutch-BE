exports.addedtogroup = async (id, group) => {

    let tr = await db.collection('user').doc(id).collection('history').add({
        message: 'Added to group',
        name: group,
    })

}


exports.paid = async (idfrom, idto, group, amt) => {

    let tr = await db.collection('user').doc(idfrom).collection('history').add({
        message: 'paid to',
        to: idto,
        name: group,
        amount: amt,
    })

}

exports.received = async (idfrom, idto, group, amt) => {

    let tr = await db.collection('user').doc(idto).collection('history').add({
        message: 'received from',
        from: idfrom,
        name: group,
        amount: amt,
    })

}