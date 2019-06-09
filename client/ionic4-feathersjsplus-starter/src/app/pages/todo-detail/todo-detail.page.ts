import { Component, OnInit } from '@angular/core';
import { /* Router, */ ActivatedRoute } from '@angular/router';
// import { NavController } from '@ionic/angular';

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
    private feathersService: FeathersService,
    private activatedRoute: ActivatedRoute,
    // private router: Router,
    // private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .subscribe(params => {
        this.todoId = params.get('todoId') || '';
        this.newItem = !this.todoId;
        console.log('TodoDetailPage got todoId: %s (newItem: %s)', this.todoId, this.newItem); // DEBUG
      });
  }

}
