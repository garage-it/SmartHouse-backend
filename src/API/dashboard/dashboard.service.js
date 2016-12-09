import DashboardModel from './dashboard.model';
import viewService from '../view/view.service';

const dashboardService = {
    create
};

export default dashboardService;

function create(createDto) {
    return new DashboardModel(createDto)
        .save()
        .then((dashboard) => viewService.create({dashboard}));
}
