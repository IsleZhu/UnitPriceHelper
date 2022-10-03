(function() {
    var host = window.location.host.toLowerCase();
    window.priceTipEnabled = true;
    console.log(host)
    if(host === 'www.harristeeter.com'){
        addPriceTipListener('kds-Price kds-Price--alternate',addListPriceTipS,1000);
    }
})();

function addPriceTipListener(tag, func, time) {
    console.log(func.call());
    var onModifiedFunc = function() {
        $(this).unbind("DOMSubtreeModified");
        func.call(this);
        $(this).bind("DOMSubtreeModified", onModifiedFunc);
    };
    var eachCallFunc = function() {
        $(tag).each(function() {
            if (!$(this).attr('priceTip')) {
                $(this).attr('priceTip', '1');
                onModifiedFunc.call(this);
            }
        });
    };
    eachCallFunc();
    if (time) {
        setInterval(eachCallFunc, time);
    }
}


function addListPriceTipS(){
    console.log('addListPriceTips is called');
    if (!window.priceTipEnabled) return;
    var totalPrice = document.getElementsByClassName('kds-Price kds-Price--alternate');
    console.log(totalPrice);
    var totalVolumn = document.getElementsByClassName('kds-Text--s text-neutral-more-prominent');
    console.log(totalVolumn);
    for(let i =0;i<totalPrice.length;i++){
        addTipsHelper(totalPrice[i].value,totalVolumn[i].textContent,i);
    }
}
function addTipsHelper(totalPrice, totalVolumn,index){
    var testResult = getUnit(totalPrice, totalVolumn);
    console.log('testResult: '+testResult);
    //insert content to page
    var priceSpan = document.createElement('span');
    priceSpan.innerHTML = "["+testResult.finalPrice+" / "+testResult.finalUnit+"]";
    priceSpan.className = 'kds-Price-promotional-dropCaps';
    //left border/margin fails to work
    priceSpan.style = "font-size: 16px; left-margin: 20px";

    document.getElementsByClassName('kds-Price-promotional kds-Price-promotional--plain kds-Price-promotional--decorated')[index].appendChild(priceSpan);
}
function getUnit(totalPrice, totalVolumn){
    //quantity cannot solve 1/2, or 0.5 yet
    var itemQuantity = totalVolumn.match(/([1-9]\d*\.?\d*)|(0\.\d*[1-9])/)[0];
    console.log(itemQuantity);
    //optimize to solve special cases as '20 ct 0.85'
    var itemUnit = totalVolumn.match(/\s((([a-zA-Z]*\s?[a-zA-Z]+)*))/)[1];
    console.log(itemUnit);
    var itemPriceByUnit = parseFloat(totalPrice) / parseFloat(itemQuantity);
    //cut long tails after digit
    itemPriceByUnit = itemPriceByUnit.toFixed(3);
    console.log(itemPriceByUnit);
    var itemFinalUnit = '';
    switch(itemUnit){
        case 'gal': itemFinalUnit = 'gal';
        break;
        case 'oz': itemFinalUnit = 'oz';
        break;
        case 'fl oz': itemFinalUnit = 'oz';
        break;
        case 'ct': itemFinalUnit = 'item';
        break;
        case 'lb': itemFinalUnit = 'lb';
        break;
        case 'bag': itemFinalUnit = 'Bag';
        break;
        case 'pack': itemFinalUnit = 'Pack';
        break;
        case 'bottles': itemFinalUnit = 'Bottle';
        break;
        case 'pk': itemFinalUnit = 'Pack';
        break;
        //may be some other units else?

        default: itemFinalUnit = 'unknown unit';
    }

    if(itemPriceByUnit > 1000 || itemPriceByUnit < 0){
        return null;
    } 
    else {
        console.log("Hihi");
        return {
            finalPrice: itemPriceByUnit,
            finalUnit: itemFinalUnit
        };
    }
}
