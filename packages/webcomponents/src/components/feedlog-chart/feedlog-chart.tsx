import { Component, Prop, h } from '@stencil/core';
import { FeedlogSDK } from '@feedlog-toolkit/core';

/**
 * Feedlog Chart Component
 * 
 * A data visualization component for displaying feed log data.
 */
@Component({
  tag: 'feedlog-chart',
  styleUrl: 'feedlog-chart.css',
  shadow: true,
})
export class FeedlogChart {
  /**
   * The data to visualize
   */
  @Prop() data: string | any[];

  /**
   * Chart type (line, bar, pie, etc.)
   */
  @Prop() type: 'line' | 'bar' | 'pie' = 'line';

  /**
   * Chart title
   */
  @Prop() title: string;

  /**
   * API key for Feedlog SDK
   */
  @Prop() apiKey?: string;

  private sdk: FeedlogSDK;

  componentWillLoad() {
    if (this.apiKey) {
      this.sdk = new FeedlogSDK(this.apiKey);
    }
  }

  private parseData(): any[] {
    if (!this.data) {
      return [];
    }
    
    if (typeof this.data === 'string') {
      try {
        return JSON.parse(this.data);
      } catch {
        return [];
      }
    }
    
    return Array.isArray(this.data) ? this.data : [];
  }

  render() {
    const chartData = this.parseData();
    
    return (
      <div class="feedlog-chart-container">
        {this.title && <h3 class="chart-title">{this.title}</h3>}
        <div class="chart-content">
          {chartData.length > 0 ? (
            <div class={`chart chart-${this.type}`}>
              {/* Chart visualization would go here */}
              <p>Chart Type: {this.type}</p>
              <p>Data Points: {chartData.length}</p>
            </div>
          ) : (
            <div class="no-data">No data available</div>
          )}
        </div>
      </div>
    );
  }
}

