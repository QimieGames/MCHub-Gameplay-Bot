module.exports = {
    data: {
        name: 'tasks_scheduler'
    },
    execute(configValues, gameplayBot) {
        try {
            console.log('MCHGB > Scheduling tasks...');

            const realmName = String(configValues.gameplay_bot.realm_name).toLowerCase();

            const realmSeason = String(configValues.gameplay_bot.realm_season);

            setTimeout(async () => {
                try {
                    gameplayBot.chat(`/server ${realmName}${realmSeason}`);
                    console.log(`MCHGB > Ran "/server ${realmName}${realmSeason}"`);
                } catch {
                    console.log(`MCHGB > Failed to run "/server ${realmName}${realmSeason}"`);
                }
            }, 3000);
            switch (realmName) {
                case 'atlantic':
                    setInterval(async () => {
                        try {
                            gameplayBot.chat(`/server ${realmName}${realmSeason}`);
                            console.log(`MCHGB > Ran "/server ${realmName}${realmSeason}"`);
                            setTimeout(() => { }, 1000);
                            try {
                                gameplayBot.chat('/nextboss');
                                console.log('MCHGB > Ran "/nextboss"');
                            } catch {
                                console.log('MCHGB > Failed to run "/nextboss"');
                            }
                        } catch {
                            console.log(`MCHGB > Failed to run "/server ${realmName}${realmSeason}"`);
                        }
                    }, 295000);
                    setInterval(async () => {
                        try {
                            gameplayBot.chat('/nextdungeon');
                            console.log('MCHGB > Ran "/nextdungeon"');
                            setTimeout(() => { }, 1000);
                            try {
                                gameplayBot.chat('/nextprospector');
                                console.log('MCHGB > Ran "/nextprospector"');
                            } catch {
                                console.log('MCHGB > Failed to run "/nextprospector"');
                            }
                        } catch {
                            console.log('MCHGB > Failed to run "/nextdungeon"');
                        }
                    }, 915000);
                    setInterval(async () => {
                        try {
                            gameplayBot.chat('/nextbloodbath');
                            console.log('MCHGB > Ran "/nextbloodbath"');
                        } catch {
                            console.log('MCHGB > Failed to run "/nextbloodbath"');
                        }
                    }, 2700000);
                    break;
                case 'sun':
                    setInterval(async () => {
                        try {
                            gameplayBot.chat(`/server ${realmName}${realmSeason}`);
                            console.log(`MCHGB > Ran "/server ${realmName}${realmSeason}"`);
                        } catch {
                            console.log(`MCHGB > Failed to run "/server ${realmName}${realmSeason}"`);
                        }
                    }, 295000);
                    setInterval(async () => {
                        try {
                            gameplayBot.chat('/nextdungeon');
                            console.log('MCHGB > Ran "/nextdungeon"');
                            setTimeout(() => { }, 1000);
                            try {
                                gameplayBot.chat('/nextboss');
                                console.log('MCHGB > Ran "/nextboss"');
                            } catch {
                                console.log('MCHGB > Failed to run "/nextboss"');
                            }
                        } catch {
                            console.log('MCHGB > Failed to run "/nextdungeon"');
                        }
                    }, 915000);
                    break;
            }
            console.log('MCHGB > Scheduled tasks.');
            return true;
        } catch (tasksSchedulerError) {
            console.log(tasksSchedulerError);
            console.log('MCHGB > Error occured while executing tasks scheduler! Restarting gameplay bot...');
            return tasksSchedulerError;
        }
    }
};