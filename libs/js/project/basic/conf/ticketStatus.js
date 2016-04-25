
CONF.project.ticketstatus = lsMapToDict({
    0:  'Неизвестно',
    1:  'Создан',
    20: 'Отклонен',
    30: 'Взят в работу',
    50: 'Решено'
});


CONF.project.ticketstatusSpec = {
    max: 50,
    min: 0,
    new: 1,
    working: 30,
    supportCan:[20,30,50]
}

CONF.project.ticketstatusColor = {
    0:  'bad',
    20: 'bad',
    1:  'neutral',
    30: 'ok',
    50: 'done'
}



