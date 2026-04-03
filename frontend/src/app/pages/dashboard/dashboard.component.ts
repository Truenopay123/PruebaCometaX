import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService, Stats } from '../../core/services/stats.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('categoryChart') categoryChartRef!: ElementRef;
  @ViewChild('monthChart') monthChartRef!: ElementRef;
  @ViewChild('valueChart') valueChartRef!: ElementRef;

  stats: Stats | null = null;
  categoryChart: Chart | null = null;
  monthChart: Chart | null = null;
  valueChart: Chart | null = null;

  monthNames: string[] = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {}

  loadStats() {
    this.statsService.getSummary().subscribe(data => {
      this.stats = data;
      setTimeout(() => {
        this.buildCategoryChart();
        this.buildMonthChart();
        this.buildValueChart();
      }, 100);
    });
  }

  buildCategoryChart() {
    if (!this.stats || !this.categoryChartRef) return;
    if (this.categoryChart) this.categoryChart.destroy();

    this.categoryChart = new Chart(this.categoryChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.stats.by_category.map(d => d.category),
        datasets: [{
          data: this.stats.by_category.map(d => d.total),
          backgroundColor: ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: false }
        }
      }
    });
  }

  buildMonthChart() {
    if (!this.stats || !this.monthChartRef) return;
    if (this.monthChart) this.monthChart.destroy();

    this.monthChart = new Chart(this.monthChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.stats.by_month.map(d => this.monthNames[d.month]),
        datasets: [
          {
            label: 'Entradas',
            data: this.stats.by_month.map(d => d.entries),
            backgroundColor: '#10b981'
          },
          {
            label: 'Salidas',
            data: this.stats.by_month.map(d => d.exits),
            backgroundColor: '#ef4444'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  buildValueChart() {
    if (!this.stats || !this.valueChartRef) return;
    if (this.valueChart) this.valueChart.destroy();

    this.valueChart = new Chart(this.valueChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.stats.inventory_value.map(d => d.category),
        datasets: [{
          label: 'Valor en inventario ($)',
          data: this.stats.inventory_value.map(d => d.value),
          backgroundColor: ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  getTotalProducts(): number {
    return this.stats?.by_category.reduce((a, b) => a + b.total, 0) ?? 0;
  }

  getTotalValue(): number {
    return this.stats?.inventory_value.reduce((a, b) => a + b.value, 0) ?? 0;
  }
}
