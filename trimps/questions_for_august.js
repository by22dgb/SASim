function updateAllInnerHtmlFrames() {
    if (mutations.Magma.active()) updateGeneratorInfo();
    updateTurkimpTime(true);

    if (challengeActive("Balance") || challengeActive("Unbalance")) updateBalanceStacks();
    if (challengeActive("Electricity") || challengeActive("Mapocalypse")) updateElectricityStacks();
    if (challengeActive("Life")) updateLivingStacks();
    if (challengeActive("Nom")) updateNomStacks();
    if (challengeActive("Toxicity")) updateToxicityStacks();
    if (challengeActive("Lead")) manageLeadStacks();

    if (game.global.antiStacks > 0) updateAntiStacks();
    updateTitimp();
    if (getHeirloomBonus("Shield", "gammaBurst") > 0) updateGammaStacks();
    setEmpowerTab();
    handlePoisonDebuff();
    handleIceDebuff();
    handleWindDebuff();

    if (!usingRealTimeOffline) {
        updateSideTrimps();
        gather();
        breed();
        updateAllBattleNumbers();
        setVoidCorruptionIcon();

        if (!game.global.preMapsActive && game.global.mapBonus > 0) {
            let innerText = game.global.mapBonus;
            if (game.talents.mapBattery.purchased && game.global.mapBonus === 10)
                innerText = "<span class='mapBonus10'>" + innerText + "</span>";
            const mapBtnElem = document.getElementById("mapsBtnText");
            const mapBtnText = `Maps (${innerText})`;
            if (mapBtnElem.innerHTML !== mapBtnText) mapBtnElem.innerHTML = mapBtnText;
        }
    }

    let cell, cellNum;
    if (game.global.mapsActive) {
        cellNum = game.global.lastClearedMapCell + 1;
        cell = game.global.mapGridArray[cellNum];
    } else {
        cellNum = game.global.lastClearedCell + 1;
        cell = game.global.gridArray[cellNum];
    }

    const badAttackElem = document.getElementById("badGuyAttack");
    const badAttackText = calculateDamage(cell.attack, true, false, false, cell);
    if (badAttackElem.innerHTML != badAttackText) badAttackElem.innerHTML = badAttackText;

    const goodAttackElem = document.getElementById("goodGuyAttack");
    const goodAttackText = calculateDamage(game.global.soldierCurrentAttack, true, true);
    if (goodAttackElem.innerHTML != goodAttackText) goodAttackElem.innerHTML = goodAttackText;
}
