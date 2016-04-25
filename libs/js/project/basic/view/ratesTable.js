new eView('ratesTable', {
    create: f(){ return _jO(cr('div', 'ratesTable')); },
    init: f(self, obj) {
        self.C.resLength = 7;
        self.V.rows = [];
        self.V.tableHead = S('.mk_table_head')[0];
        self.V.tableHead.innerHTML = '';
        obj.V.table_cont.innerHTML = '';
        obj.V.table_cont.addCls('table-shadow');

        //- create rows and cells for each AC currency
        map(obj.C.acCurList, f(accurrency) {
            var rowData = obj.C.rowDataDict[accurrency.id],
                row = obj.V.table_cont.cr('div', 'row'),
                rowContent = cr('div', 'row-content mk_ext hide'),
                rowTitle = row.cr('div', 'row-title payments-trigger-container mk_trigger'),
                titleCont,
                icon,
                str;

            rowTitle.cr('div', 'mob-arr-shadow-down');
            rowTitle.cr('div', 'mob-arr-down').cr('div', 'mob-triangle-arr-container').cr('div', 'mob-triangle-down');
            rowTitle.cr('div', 'payments-triangle');
            rowTitle.cr('div', 'payments-shadow');
            rowTitle.cr('div', 'payments-trigger-bg');
            titleCont = rowTitle.cr('div', 'payments-text-container');
            icon = titleCont.cr('span', 'cur_icon').cr('img');

            self.V.tableHead.cr('div').VAL(accurrency.name);

            if ( def(rowData) ) {
                str = '1 ' + rowData.in_currency.displayname;
                icon.src = [ENGINE.path.static, 'image/rates-table-cur/', accurrency.name, '.png'].join('');
            } else {
                str = '';
                row.addCls('mob_invis_row');
            }

            titleCont.cr('span', 'cur_text').VAL(str);

            map(obj.C.acCurList, f(accur, index) {
                var anchor = rowContent.cr('a', 'cell'),
                    rateNode = anchor.cr('span'),
                    displayNameNode = anchor.cr('span', 'mob_only'),
                    rate;
                if ( def(rowData) && def(rowData.out_currencies[accur.id])) {
                    rate = parseFloat((1).fromDec() / rowData.exchanges[accur.id].rate).toString().slice(0, self.C.resLength);
                    clearEvents(anchor).addEventListener('click', function() {
                        var url = obj.F._setExchangeLink(rowData.in_currency.name, rowData.out_currencies[accur.id].name);
                        LM.go(url);
                    });
                    displayNameNode.VAL(' ' + rowData.out_currencies[accur.id].displayname);
                } else {
                    rate = '';
                    anchor.addCls('transparent_cell');
                }
                rateNode.VAL(rate);
            });

            row.attach(rowContent);
            row.rowTitle = rowTitle;
            row.rowContent = rowContent;
            self.V.rows.push(row);
        });

        self.V.rows[0].rowTitle.addCls('active');
        self.V.rows[0].rowContent.remCls('hide');

        map(self.V.rows, f(row) {
            evt(row, 'mouseover', f() {
                if ( EVENT.data.windowSize.x <= %wrapperRatesMobile ) { return 0; }
                map(self.V.rows, f(val) {
                    val.rowTitle.remCls('active');
                });
                row.rowTitle.addCls('active');
            });
        });

        PROCESSOR.mobExtendBlock.process(obj.V.table_cont);
    }
});
