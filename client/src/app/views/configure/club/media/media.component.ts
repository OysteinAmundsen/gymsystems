import { Component, OnInit } from '@angular/core';
import { GraphService } from 'app/shared/services/graph.service';
import { ConfigurationService } from 'app/shared/services/api';
import { IDiscipline } from 'app/model/IDiscipline';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  disciplines: IDiscipline[] = [];

  constructor(private graph: GraphService, private configService: ConfigurationService) { }

  ngOnInit() {
    this.configService.getByname('defaultValues').subscribe(config => this.disciplines = config.value.discipline);
  }
}
