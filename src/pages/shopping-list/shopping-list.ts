import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { PopoverController } from 'ionic-angular';

import { ShoppingListService } from "../../services/shopping-list";
import { Ingredient } from "../../models/ingredient";
import { SlOptionsPage } from './sl-options/sl-options';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  listItems: Ingredient[];

  constructor(private slService: ShoppingListService,
    private popoverCtrl: PopoverController,
    private authService: AuthService){}

  ionViewWillEnter(){
    this.loadItems();
  }

  onAddItem(form: NgForm) {
    this.slService.addItem(form.value.ingredientName, form.value.amount);
    form.reset();
    this.loadItems();
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(SlOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(
      data => {
        if (data.action == 'load') {

        } else {
          this.authService.getActiveUser().getIdToken()
          .then(
            (token: string) => {
              this.slService.storeList(token).subscribe(
                () => console.log('Success!'),
                error => {
                  console.log(error);
                }
              )
            }
          );
        }
      }
    );
  }

  private loadItems(){
    this.listItems = this.slService.getItems();
  }

  onCheckItem(index: number){
    this.slService.removeItem(index);
    this.loadItems();
  }
}
