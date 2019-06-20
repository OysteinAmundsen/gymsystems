'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">gymsystems_client documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdvancedModule.html" data-type="entity-link">AdvancedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdvancedModule-0a8f70df71ae1d2c9f2cd402f029a2d1"' : 'data-target="#xs-components-links-module-AdvancedModule-0a8f70df71ae1d2c9f2cd402f029a2d1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdvancedModule-0a8f70df71ae1d2c9f2cd402f029a2d1"' :
                                            'id="xs-components-links-module-AdvancedModule-0a8f70df71ae1d2c9f2cd402f029a2d1"' }>
                                            <li class="link">
                                                <a href="components/AdvancedComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdvancedComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-4fa3be624afb94ab246c4cdd98f69bda"' : 'data-target="#xs-components-links-module-AppModule-4fa3be624afb94ab246c4cdd98f69bda"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-4fa3be624afb94ab246c4cdd98f69bda"' :
                                            'id="xs-components-links-module-AppModule-4fa3be624afb94ab246c4cdd98f69bda"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResetComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ResetComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppServerModule.html" data-type="entity-link">AppServerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppServerModule-e97367b48d7501e3e3d5dced8d3e526f"' : 'data-target="#xs-components-links-module-AppServerModule-e97367b48d7501e3e3d5dced8d3e526f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppServerModule-e97367b48d7501e3e3d5dced8d3e526f"' :
                                            'id="xs-components-links-module-AppServerModule-e97367b48d7501e3e3d5dced8d3e526f"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ClubModule.html" data-type="entity-link">ClubModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ClubModule-4cc2a6bc4970904cc39ca1a21b1c005a"' : 'data-target="#xs-components-links-module-ClubModule-4cc2a6bc4970904cc39ca1a21b1c005a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ClubModule-4cc2a6bc4970904cc39ca1a21b1c005a"' :
                                            'id="xs-components-links-module-ClubModule-4cc2a6bc4970904cc39ca1a21b1c005a"' }>
                                            <li class="link">
                                                <a href="components/ClubComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClubComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClubEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClubEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MediaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MediaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MemberEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MemberEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MembersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MembersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatisticsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StatisticsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TroopEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TroopEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TroopsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TroopsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClubModule-4cc2a6bc4970904cc39ca1a21b1c005a"' : 'data-target="#xs-injectables-links-module-ClubModule-4cc2a6bc4970904cc39ca1a21b1c005a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClubModule-4cc2a6bc4970904cc39ca1a21b1c005a"' :
                                        'id="xs-injectables-links-module-ClubModule-4cc2a6bc4970904cc39ca1a21b1c005a"' }>
                                        <li class="link">
                                            <a href="injectables/MemberStateService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MemberStateService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigureModule.html" data-type="entity-link">ConfigureModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ConfigureModule-382678a03ce0d9b88401564a6f68cdd8"' : 'data-target="#xs-components-links-module-ConfigureModule-382678a03ce0d9b88401564a6f68cdd8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ConfigureModule-382678a03ce0d9b88401564a6f68cdd8"' :
                                            'id="xs-components-links-module-ConfigureModule-382678a03ce0d9b88401564a6f68cdd8"' }>
                                            <li class="link">
                                                <a href="components/ConfigureComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfigureComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigureDisplayComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfigureDisplayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MacroDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MacroDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigureRoutingModule.html" data-type="entity-link">ConfigureRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigureSharedModule.html" data-type="entity-link">ConfigureSharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ConfigureSharedModule-66b2d531a3946b911b36feb64d086e1f"' : 'data-target="#xs-components-links-module-ConfigureSharedModule-66b2d531a3946b911b36feb64d086e1f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ConfigureSharedModule-66b2d531a3946b911b36feb64d086e1f"' :
                                            'id="xs-components-links-module-ConfigureSharedModule-66b2d531a3946b911b36feb64d086e1f"' }>
                                            <li class="link">
                                                <a href="components/DivisionLookupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DivisionLookupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MemberSelectorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MemberSelectorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DisciplinesModule.html" data-type="entity-link">DisciplinesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DisciplinesModule-feb48241527c2145b94d86b1cc1672e7"' : 'data-target="#xs-components-links-module-DisciplinesModule-feb48241527c2145b94d86b1cc1672e7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DisciplinesModule-feb48241527c2145b94d86b1cc1672e7"' :
                                            'id="xs-components-links-module-DisciplinesModule-feb48241527c2145b94d86b1cc1672e7"' }>
                                            <li class="link">
                                                <a href="components/DisciplineEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DisciplineEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DisciplinesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DisciplinesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DivisionsModule.html" data-type="entity-link">DivisionsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DivisionsModule-d5821c3d3d204752c833d99226004507"' : 'data-target="#xs-components-links-module-DivisionsModule-d5821c3d3d204752c833d99226004507"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DivisionsModule-d5821c3d3d204752c833d99226004507"' :
                                            'id="xs-components-links-module-DivisionsModule-d5821c3d3d204752c833d99226004507"' }>
                                            <li class="link">
                                                <a href="components/DivisionEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DivisionEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DivisionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DivisionsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EventModule.html" data-type="entity-link">EventModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EventModule-7c16e0d743771f95455ebeaf1e43f8c4"' : 'data-target="#xs-components-links-module-EventModule-7c16e0d743771f95455ebeaf1e43f8c4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EventModule-7c16e0d743771f95455ebeaf1e43f8c4"' :
                                            'id="xs-components-links-module-EventModule-7c16e0d743771f95455ebeaf1e43f8c4"' }>
                                            <li class="link">
                                                <a href="components/ContextMenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContextMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DisplayComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DisplayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FullscreenComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FullscreenComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ResultsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScoreEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ScoreEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignoffReportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SignoffReportComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EventRoutingModule.html" data-type="entity-link">EventRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GraphQLModule.html" data-type="entity-link">GraphQLModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ScoreSystemModule.html" data-type="entity-link">ScoreSystemModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ScoreSystemModule-ab625678bff0d264fabb154675731d7e"' : 'data-target="#xs-components-links-module-ScoreSystemModule-ab625678bff0d264fabb154675731d7e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ScoreSystemModule-ab625678bff0d264fabb154675731d7e"' :
                                            'id="xs-components-links-module-ScoreSystemModule-ab625678bff0d264fabb154675731d7e"' }>
                                            <li class="link">
                                                <a href="components/ScoreGroupEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ScoreGroupEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScoreSystemComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ScoreSystemComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' : 'data-target="#xs-components-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' :
                                            'id="xs-components-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' }>
                                            <li class="link">
                                                <a href="components/ClubLookupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClubLookupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ErrorDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ErrorDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HelpBlockComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HelpBlockComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoadSpinnerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoadSpinnerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MediaControlComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MediaControlComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MultirangeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MultirangeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SaveButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SaveButtonComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' : 'data-target="#xs-directives-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' :
                                        'id="xs-directives-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' }>
                                        <li class="link">
                                            <a href="directives/IfAuthDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">IfAuthDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ToCaseDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToCaseDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' : 'data-target="#xs-pipes-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' :
                                            'id="xs-pipes-links-module-SharedModule-fe88aa121febd7c2761ef6c7dc8ad1df"' }>
                                            <li class="link">
                                                <a href="pipes/OrderByPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrderByPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/UtcDatePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UtcDatePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TournamentModule.html" data-type="entity-link">TournamentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TournamentModule-fac8a99ae6f892ae1c2bccab45037713"' : 'data-target="#xs-components-links-module-TournamentModule-fac8a99ae6f892ae1c2bccab45037713"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TournamentModule-fac8a99ae6f892ae1c2bccab45037713"' :
                                            'id="xs-components-links-module-TournamentModule-fac8a99ae6f892ae1c2bccab45037713"' }>
                                            <li class="link">
                                                <a href="components/AwardsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AwardsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InfoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScheduleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ScheduleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScorecardsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ScorecardsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TeamEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TeamsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TournamentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TournamentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TournamentEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TournamentEditorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link">UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UsersModule-758b6f4285ec6bd26796f90b4342a93e"' : 'data-target="#xs-components-links-module-UsersModule-758b6f4285ec6bd26796f90b4342a93e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsersModule-758b6f4285ec6bd26796f90b4342a93e"' :
                                            'id="xs-components-links-module-UsersModule-758b6f4285ec6bd26796f90b4342a93e"' }>
                                            <li class="link">
                                                <a href="components/PasswordComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VenueModule.html" data-type="entity-link">VenueModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-VenueModule-7b896dbd1673b56158400ff414e6ffe8"' : 'data-target="#xs-components-links-module-VenueModule-7b896dbd1673b56158400ff414e6ffe8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VenueModule-7b896dbd1673b56158400ff414e6ffe8"' :
                                            'id="xs-components-links-module-VenueModule-7b896dbd1673b56158400ff414e6ffe8"' }>
                                            <li class="link">
                                                <a href="components/VenueComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VenueComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VenueEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VenueEditorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/TeamEditorComponent.html" data-type="entity-link">TeamEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TeamsComponent.html" data-type="entity-link">TeamsComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ExpansionSource.html" data-type="entity-link">ExpansionSource</a>
                            </li>
                            <li class="link">
                                <a href="classes/Judge.html" data-type="entity-link">Judge</a>
                            </li>
                            <li class="link">
                                <a href="classes/Logger.html" data-type="entity-link">Logger</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScoreContainer.html" data-type="entity-link">ScoreContainer</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubjectSource.html" data-type="entity-link">SubjectSource</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BrowserService.html" data-type="entity-link">BrowserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommonService.html" data-type="entity-link">CommonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigurationService.html" data-type="entity-link">ConfigurationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DisplayService.html" data-type="entity-link">DisplayService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorHandlerService.html" data-type="entity-link">ErrorHandlerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GraphService.html" data-type="entity-link">GraphService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpCacheService.html" data-type="entity-link">HttpCacheService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpStateService.html" data-type="entity-link">HttpStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoadIndicatorService.html" data-type="entity-link">LoadIndicatorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MediaService.html" data-type="entity-link">MediaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MemberStateService.html" data-type="entity-link">MemberStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MyHammerConfig.html" data-type="entity-link">MyHammerConfig</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ScheduleService.html" data-type="entity-link">ScheduleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SEOService.html" data-type="entity-link">SEOService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link">AuthInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/HttpCacheInterceptor.html" data-type="entity-link">HttpCacheInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/UniversalInterceptor.html" data-type="entity-link">UniversalInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/CanActivateRegistration.html" data-type="entity-link">CanActivateRegistration</a>
                            </li>
                            <li class="link">
                                <a href="guards/RoleGuard.html" data-type="entity-link">RoleGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ExpansionRow.html" data-type="entity-link">ExpansionRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpAction.html" data-type="entity-link">HttpAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBelongsToClub.html" data-type="entity-link">IBelongsToClub</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IClub.html" data-type="entity-link">IClub</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConfiguration.html" data-type="entity-link">IConfiguration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICreatedBy.html" data-type="entity-link">ICreatedBy</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDiscipline.html" data-type="entity-link">IDiscipline</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDivision.html" data-type="entity-link">IDivision</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGymnast.html" data-type="entity-link">IGymnast</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IJudge.html" data-type="entity-link">IJudge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IJudgeInScoreGroup.html" data-type="entity-link">IJudgeInScoreGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMedia.html" data-type="entity-link">IMedia</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IScore.html" data-type="entity-link">IScore</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IScoreContainer.html" data-type="entity-link">IScoreContainer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IScoreGroup.html" data-type="entity-link">IScoreGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITeam.html" data-type="entity-link">ITeam</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITeamInDiscipline.html" data-type="entity-link">ITeamInDiscipline</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITournament.html" data-type="entity-link">ITournament</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITournamentTimes.html" data-type="entity-link">ITournamentTimes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITroop.html" data-type="entity-link">ITroop</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser.html" data-type="entity-link">IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IVenue.html" data-type="entity-link">IVenue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ParticipantCache.html" data-type="entity-link">ParticipantCache</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoleData.html" data-type="entity-link">RoleData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TotalByScoreGroup.html" data-type="entity-link">TotalByScoreGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TournamentType.html" data-type="entity-link">TournamentType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UrlActivity.html" data-type="entity-link">UrlActivity</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});