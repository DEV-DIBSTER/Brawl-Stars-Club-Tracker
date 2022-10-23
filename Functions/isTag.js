function IsTag(tag){
    if (tag.length < 3) return false;
    for (let i = 0; i < tag.length; i++) {
        if (!'0289CGJLPQRUVY'.includes(tag[i])){
            false;
        };
    };
    return true;
};

module.exports = { IsTag };