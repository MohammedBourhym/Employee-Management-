import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private departmentColors: { [key: string]: string } = {};
  private positionStyles: { [key: string]: { color: string; backgroundColor: string } } = {};

  private generateColor(input: string): string {
    return stringToColor(input);
  }

  getDepartmentColor(department: string): string {
    if (!this.departmentColors[department]) {
      this.departmentColors[department] = this.generateColor(department);
    }
    return this.departmentColors[department];
  }

  getPositionStyle(position: string): { color: string; backgroundColor: string } {
    if (!this.positionStyles[position]) {
      const bgColor = this.generateColor(position);
      this.positionStyles[position] = {
        color: '#ffffff', // Default text color
        backgroundColor: bgColor,
      };
    }
    return this.positionStyles[position];
  }
}

// Utility function
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
