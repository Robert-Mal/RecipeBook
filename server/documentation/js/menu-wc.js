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
                    <a href="index.html" data-type="index-link">playground documentation</a>
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
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-313a36ebb5b215365a9c8093dce9ff7038024935dd8e00709d91abc7a9c372f136784829014540c4db271ab409a8579b45b193ff8c965f069d713308d9828210"' : 'data-target="#xs-injectables-links-module-AuthModule-313a36ebb5b215365a9c8093dce9ff7038024935dd8e00709d91abc7a9c372f136784829014540c4db271ab409a8579b45b193ff8c965f069d713308d9828210"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-313a36ebb5b215365a9c8093dce9ff7038024935dd8e00709d91abc7a9c372f136784829014540c4db271ab409a8579b45b193ff8c965f069d713308d9828210"' :
                                        'id="xs-injectables-links-module-AuthModule-313a36ebb5b215365a9c8093dce9ff7038024935dd8e00709d91abc7a9c372f136784829014540c4db271ab409a8579b45b193ff8c965f069d713308d9828210"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EatingPlanModule.html" data-type="entity-link" >EatingPlanModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EatingPlanModule-24d53ccfeaef82206113fdeeda851f70497efe0fb9ef2b9ddfdd7e278208f1351549933720f3c188043df6e1598c1bb011329c918b7c55d71ee68389836854aa"' : 'data-target="#xs-injectables-links-module-EatingPlanModule-24d53ccfeaef82206113fdeeda851f70497efe0fb9ef2b9ddfdd7e278208f1351549933720f3c188043df6e1598c1bb011329c918b7c55d71ee68389836854aa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EatingPlanModule-24d53ccfeaef82206113fdeeda851f70497efe0fb9ef2b9ddfdd7e278208f1351549933720f3c188043df6e1598c1bb011329c918b7c55d71ee68389836854aa"' :
                                        'id="xs-injectables-links-module-EatingPlanModule-24d53ccfeaef82206113fdeeda851f70497efe0fb9ef2b9ddfdd7e278208f1351549933720f3c188043df6e1598c1bb011329c918b7c55d71ee68389836854aa"' }>
                                        <li class="link">
                                            <a href="injectables/EatingPlanService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EatingPlanService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RecipeModule.html" data-type="entity-link" >RecipeModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RecipeModule-f8560d69bba942cb2b4d42d95e4d7a5c1c7a3ae3c1647aaebea5122e8beb48663958b8c355a124aaf11835381196f4ca5d6473526a2d7138982067822d610ff6"' : 'data-target="#xs-injectables-links-module-RecipeModule-f8560d69bba942cb2b4d42d95e4d7a5c1c7a3ae3c1647aaebea5122e8beb48663958b8c355a124aaf11835381196f4ca5d6473526a2d7138982067822d610ff6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RecipeModule-f8560d69bba942cb2b4d42d95e4d7a5c1c7a3ae3c1647aaebea5122e8beb48663958b8c355a124aaf11835381196f4ca5d6473526a2d7138982067822d610ff6"' :
                                        'id="xs-injectables-links-module-RecipeModule-f8560d69bba942cb2b4d42d95e4d7a5c1c7a3ae3c1647aaebea5122e8beb48663958b8c355a124aaf11835381196f4ca5d6473526a2d7138982067822d610ff6"' }>
                                        <li class="link">
                                            <a href="injectables/RecipeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecipeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ShoppingListModule.html" data-type="entity-link" >ShoppingListModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ShoppingListModule-7f80e6402ce59ce1ffb2e931d54ab39d8cea5dcd17511a3f742cecbf5b5b8eea7c466c3a2ba97880279d52396c56b4fe928ee7a18f98308e45470b212729661c"' : 'data-target="#xs-injectables-links-module-ShoppingListModule-7f80e6402ce59ce1ffb2e931d54ab39d8cea5dcd17511a3f742cecbf5b5b8eea7c466c3a2ba97880279d52396c56b4fe928ee7a18f98308e45470b212729661c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ShoppingListModule-7f80e6402ce59ce1ffb2e931d54ab39d8cea5dcd17511a3f742cecbf5b5b8eea7c466c3a2ba97880279d52396c56b4fe928ee7a18f98308e45470b212729661c"' :
                                        'id="xs-injectables-links-module-ShoppingListModule-7f80e6402ce59ce1ffb2e931d54ab39d8cea5dcd17511a3f742cecbf5b5b8eea7c466c3a2ba97880279d52396c56b4fe928ee7a18f98308e45470b212729661c"' }>
                                        <li class="link">
                                            <a href="injectables/ShoppingListService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShoppingListService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-a8c60eeb86bc44c5c616b6f80d4caff668a15ccd2d0f5816e9a163902c8706a27c9c2383ce5f2a4b628f8a11b1520845ca8fc332b02f1ac8b4299450d03e0444"' : 'data-target="#xs-injectables-links-module-UserModule-a8c60eeb86bc44c5c616b6f80d4caff668a15ccd2d0f5816e9a163902c8706a27c9c2383ce5f2a4b628f8a11b1520845ca8fc332b02f1ac8b4299450d03e0444"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-a8c60eeb86bc44c5c616b6f80d4caff668a15ccd2d0f5816e9a163902c8706a27c9c2383ce5f2a4b628f8a11b1520845ca8fc332b02f1ac8b4299450d03e0444"' :
                                        'id="xs-injectables-links-module-UserModule-a8c60eeb86bc44c5c616b6f80d4caff668a15ccd2d0f5816e9a163902c8706a27c9c2383ce5f2a4b628f8a11b1520845ca8fc332b02f1ac8b4299450d03e0444"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateEatingPlanInput.html" data-type="entity-link" >CreateEatingPlanInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRecipeInput.html" data-type="entity-link" >CreateRecipeInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateShoppingListInput.html" data-type="entity-link" >CreateShoppingListInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/EatingPlan.html" data-type="entity-link" >EatingPlan</a>
                            </li>
                            <li class="link">
                                <a href="classes/EatingPlanResolver.html" data-type="entity-link" >EatingPlanResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/GqlAuthGuard.html" data-type="entity-link" >GqlAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="classes/Ingredient.html" data-type="entity-link" >Ingredient</a>
                            </li>
                            <li class="link">
                                <a href="classes/IngredientInput.html" data-type="entity-link" >IngredientInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoggedUserOutput.html" data-type="entity-link" >LoggedUserOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/Meal.html" data-type="entity-link" >Meal</a>
                            </li>
                            <li class="link">
                                <a href="classes/MealInput.html" data-type="entity-link" >MealInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/MealResolver.html" data-type="entity-link" >MealResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Recipe.html" data-type="entity-link" >Recipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecipeResolver.html" data-type="entity-link" >RecipeResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShoppingList.html" data-type="entity-link" >ShoppingList</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShoppingListResolver.html" data-type="entity-link" >ShoppingListResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInInput.html" data-type="entity-link" >SignInInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpInput.html" data-type="entity-link" >SignUpInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEatingPlanInput.html" data-type="entity-link" >UpdateEatingPlanInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRecipeInput.html" data-type="entity-link" >UpdateRecipeInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateShoppingListInput.html" data-type="entity-link" >UpdateShoppingListInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserInput.html" data-type="entity-link" >UpdateUserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResolver.html" data-type="entity-link" >UserResolver</a>
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
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EatingPlanService.html" data-type="entity-link" >EatingPlanService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecipeService.html" data-type="entity-link" >RecipeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ShoppingListService.html" data-type="entity-link" >ShoppingListService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
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
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/FileUpload.html" data-type="entity-link" >FileUpload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
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