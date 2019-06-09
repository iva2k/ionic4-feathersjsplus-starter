import { Component, OnInit } from '@angular/core';
import { /* Router, */ ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { FeathersService } from '../../services/feathers.service';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.page.html',
  styleUrls: ['./todo-detail.page.scss'],
})
export class TodoDetailPage implements OnInit {
  protected newItem: boolean; // true if opened without navParams, so it is an "Add" command.
  protected todoId: string;

  constructor(
    public feathersService: FeathersService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    // private router: Router,
  ) {
    console.log('TodoDetailPage got todoId: %s (newItem: %s)', this.todoId, this.newItem); // DEBUG
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .subscribe(params => {
        this.todoId = params.get('todoId') || '';
        this.newItem = !this.todoId;
      });
  }

  // Command completed
  public onDone(event) {
    console.log('TodoDetailPage command done. event: %o', event);
    console.log(`Task "${event.item.title}" ${event.action}.`);
    // TODO: Implement Toast e.g. `Item "${event.item.title}" ${event.action}.` => 'Item "Task 1" removed.'
    // let params = {};
    // IONIC3: this.navCtrl.pop(); // TODO: (now) pop() method in IONIC4?
    this.navCtrl.back(); // TODO: (soon) Fix navigation back. Sometimes crashes, never actually works.
    // ? this.router.
  }

}
