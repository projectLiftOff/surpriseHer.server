'use strict'

var MemCache = {};
var _Gifts = {};

MemCache.addGifts = function( gifts ) {
    gifts.forEach(function(gift){
        var lookupId = gift.look_up + gift.gift_id;
        _Gifts[ lookupId ] = gift;
    });
};

MemCache.getGift = function( lookupId ) {
    return _Gifts[ lookupId ];
}

MemCache.hasGiftsOfMonth = function( monthOf ) {
    if( Object.keys(_Gifts).length === 0 ) return false;
    _.forEach( _Gifts, function(gift){
        if( gift.month_of !== monthOf ) return false;
    });
    return _Gifts[ lookupId ];
}

module.exports = MemCache;