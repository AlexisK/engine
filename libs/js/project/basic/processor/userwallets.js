new eProcessor('userwallets', {
    process: f(self, db) {
        if ( !PAGE.user ) { return 0; }
        _jO(self);
        self.V = selectorMapping(self, {
            '.mk_wallet_currencies': 'currencies',
            '.mk_wallet_paysystems': 'paysystems',
            '.mk_wallet_comment': 'commentInput',
            '.mk_wallet_number': 'accNumberInput',
            '.mk_wallet_submit': 'submitBtn',
            '.mk_wallets_table': 'walletsTable',
            '.wallets-table-placeholder': 'placeholder'
        });

        self.C.psList = CASH.calc.in_ps.concat(CASH.calc.out_ps.filter(function (item) {
            return CASH.calc.in_ps.indexOf(item) < 0;
        }));        
        self.C.psList.sort(f(a, b) {
            return a.params.order - b.params.order;
        });
        self.F.createPSDropdown = function() {
            var psNodesList = [];
            map(self.C.psList, f(ps) {
                var node = cr('div', 'ps-view-'+ps.name);
                var icon = node.cr('div', 'ps-icon');
                var name = node.cr('div', 'ps-name');
                //- if the PS has no displayname, the 'name' property is used!
                var displayName = ps.langdata[PAGE.lang].displayname || ps.name;
                name.VAL(displayName);
                icon.style.backgroundImage = 'url(' + ENGINE.path.static + 'image/ps/' + ps.name + '-big.png)';
                psNodesList.push(node);
            });
            self.V.psDropdown = cr.dropdown(psNodesList, 'ps-dropdown', self.V.paysystems, { noUpdateOnVal: true });
            self.C.activePS = self.V.psDropdown.val;
            self.V.psDropdown.onupdate(f(i) {
                self.C.activePS = self.C.psList[i];
                self.F.createCurDropdown();
            });
        }

        self.F.createCurDropdown = function() {
            var curNodesList = [];
            if ( def(self.C.activePS) ) {                
                var currencies = self.C.activePS._rel.currency.sort(f(a,b) {
                    return a._rel.accurrency.order - b._rel.accurrency.order;
                });
                map(currencies, f(cur) {
                    var node = cr('div', 'cur-view-'+cur.name);
                    node.VAL(cur._rel.accurrency.name);
                    curNodesList.push(node);
                });
            }

            self.V.currencies.innerHTML = '';

            self.V.curDropdown = cr.dropdown(curNodesList, 'cur-dropdown', self.V.currencies, { noUpdateOnVal: true });
            self.V.curDropdown.onupdate(f(i) {
                self.C.activeCur = currencies[i];
            });
            if ( def(self.V.curDropdown._ddnodes[0]) ) { self.V.curDropdown._ddnodes[0].clickOn(); }
        }


        self.F.validateAccNumber = function() {
            return PS[self.C.activePS.name].validator(self.V.accNumberInput);
        }
        self.F.insertWallet = function() {
            if ( self.F.validateAccNumber() ) {
                var req = {
                    currency_id: self.C.activeCur.id,
                    displayname: self.V.accNumberInput.val,
                    title: self.V.commentInput.val
                };
                
                ORM.req('wallet:insert', req, f(resp) {
                    map(resp, f(wal) {
                        PAGE.userData.wallet.push(wal);
                    });
                    self.V.accNumberInput.val = '';
                    self.V.commentInput.val = '';
                    self.F.updateTable();
                    self.V.accNumberInput.remCls('isValid');
                });
            }
        }
        self.F.updateTable = function() {
            ORM.req('wallet:select', f(walletList) {
                self.F.prepWallets(walletList);
            }, { selector: { owner_id: ['=', PAGE.user.id] } });
        }

        self.F.prepWallets = function(wallets) {
            var walletsData = {};
            var walletsOrdered = [];
            map(wallets, f(wallet) {
                var walletPS = wallet._rel.currency._rel.paysystem;
                if ( !def(walletsData[walletPS._oid]) ) {
                    walletsData[walletPS._oid] = {
                        wallets: [wallet],
                        paysystem: walletPS 
                    };
                } else {
                    walletsData[walletPS._oid].wallets.push(wallet);
                }
            });

            mapO(walletsData, f(walletData) {
                walletsOrdered.push(walletData);
            });

            walletsOrdered.sort(f(a,b) {
                return a.paysystem.params.order - b.paysystem.params.order;
            });
            self.F._displayWallets(walletsOrdered);
        }
        self.F._displayWallets = function(wallets) {
            var tables = S('.wallets-table', self.V.walletsTable);
            map(tables, f(node) { node.detach(); });
            if ( wallets.length <= 0 ) {
                self.V.placeholder.remCls('hidden');
                return 0;
            }
            self.V.placeholder.addCls('hidden');
            function createTable(parent, data) {
                var tBody = parent.cr('div', 'wallets-table-body');
                map(data, f(wallet) {
                    var row = tBody.cr('div', 'wallets-table-row'),
                        curCol = row.cr('div', 'wallets-table-col'),
                        colsGroup = row.cr('div', 'wallets-table-col'),
                        accNumCol = colsGroup.cr('div', 'wallets-table-subcol'),
                        commentCol = colsGroup.cr('div', 'wallets-table-subcol'),
                        controlsCol = row.cr('div', 'wallets-table-col'),
                        deleteBtn = controlsCol.cr('div', 'delete-btn');

                    //- curCol.VAL(wallet._rel.currency.displayname);
                    curCol.VAL(wallet._rel.currency._rel.accurrency.name);
                    accNumCol.VAL(wallet.displayname);
                    commentCol.VAL(wallet.title);

                    evt(deleteBtn, 'click', f() {
                        ORM.req('wallet:delete', self.F.updateTable, { selector: { id: ['=', wallet.id] } });
                    });
                });
            }
            map(wallets, f(walletData) {
                var ps = walletData.paysystem;
                var cont = self.V.walletsTable.cr('div', 'wallets-table');
                var head = cont.cr('div', 'wallets-table-head');
                var logo = head.cr('div', 'wallets-ps-logo');
                var title = head.cr('div', 'wallets-ps-title');
                var displayName = ps.langdata[PAGE.lang].displayname || ps.name;
                logo.style.backgroundImage = 'url(' + ENGINE.path.static + 'image/ps/' + ps.name + '-big.png)';
                title.VAL(displayName);
                createTable(cont, walletData.wallets);
            })
        }

        self.F.createPSDropdown();
        self.F.createCurDropdown();
        self.F.prepWallets(PAGE.userData.wallet);

        self.V.accNumberInput.onupdate(self.F.validateAccNumber);

        evt(self.V.submitBtn, 'click', f() {
            self.F.insertWallet();
        });
    }
});


















