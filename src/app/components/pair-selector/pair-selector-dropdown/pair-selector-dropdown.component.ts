import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

import { TradingPairsLoadState } from '../../../shared/trading-pairs-load-state';

@Component({
    selector: 'sl-pair-selector-dropdown',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pair-selector-dropdown.component.html',
    styleUrls: ['./pair-selector-dropdown.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PairSelectorDropdownComponent implements OnInit, OnDestroy, OnChanges {
    // Manage loading state and data of trading pairs
    @Input() tradingPairsState: TradingPairsLoadState | null = null;

    @Input() activeSymbols: string[] | null = null;
    @Input() selectedPair: string | null = null;

    @Output() pairSelected = new EventEmitter<string>();
    @Output() addPairClicked = new EventEmitter<void>();

    // References to the search input and dropdown elements in the template
    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild('dropdownList') dropdownList!: ElementRef<HTMLUListElement>;

    displayedPairs: string[] = [];
    searchTerm: string = '';
    isDropdownOpen: boolean = false;
    allPairsLoaded = false;

    private allPairs: string[] = [];
    private readonly destroy$ = new Subject<void>();
    private initialLoadCount = 20;

    constructor() {
    }

    ngOnInit(): void {
        if (this.tradingPairsState?.kind === 'success' && this.tradingPairsState.pairs) {
            this.allPairs = [...this.tradingPairsState.pairs];
            this.displayedPairs = this.allPairs.slice(0, this.initialLoadCount);
        }
    }

    // Update displayed pairs based on component's inputs changes
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tradingPairsState'] && changes['tradingPairsState'].currentValue?.kind === 'success' && changes['tradingPairsState'].currentValue.pairs) {
            this.allPairs = [...changes['tradingPairsState'].currentValue.pairs];
            this.displayedPairs = this.allPairs.slice(0, this.initialLoadCount);
            this.allPairsLoaded = false;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSearchInput(event: Event): void {
        this.searchTerm = (event.target as HTMLInputElement).value;
        this.isDropdownOpen = true;
        this.filterPairs();
    }

    filterPairs(): void {
        let filteredPairs: string[];

        if (this.searchTerm) {
            filteredPairs = this.allPairs.filter(pair =>
                pair.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        } else {
            if (this.allPairsLoaded) {
                filteredPairs = [...this.allPairs];
            } else {
                filteredPairs = this.allPairs.slice(0, this.displayedPairs.length);
            }
        }

        this.displayedPairs = filteredPairs;
    }

    loadAllPairs(): void {
        if (this.tradingPairsState?.kind === 'success' && this.tradingPairsState.pairs) {
            this.displayedPairs = [...this.allPairs];
            this.allPairsLoaded = true;
        }
    }

    selectPair(pair: string): void {
        this.selectedPair = pair;

        if (this.searchInput) {
            this.searchInput.nativeElement.value = pair;
        }

        this.searchTerm = pair;
        this.pairSelected.emit(pair);
        this.isDropdownOpen = false;
    }

    onAddPairClicked(): void {
        if (this.selectedPair) {
            this.addPairClicked.emit();
            this.selectedPair = null;
            this.searchTerm = '';
            this.filterPairs();

            if (this.searchInput) {
                this.searchInput.nativeElement.value = '';
            }

            this.allPairsLoaded = false;
            this.displayedPairs = this.allPairs.slice(0, this.initialLoadCount);
        }
    }

    onFocus(): void {
        this.isDropdownOpen = true;
        this.filterPairs();
    }

    // Handle clicks outside the input and the dropdown list
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (this.isDropdownOpen && this.searchInput && this.dropdownList) {
            const inputElement = this.searchInput.nativeElement;
            const dropdownElement = this.dropdownList.nativeElement;
            const clickedInsideInput = inputElement.contains(event.target as Node);
            const clickedInsideDropdown = dropdownElement.contains(event.target as Node);

            if (!clickedInsideInput && !clickedInsideDropdown) {
                this.isDropdownOpen = false;
                this.allPairsLoaded = false;
                this.displayedPairs = this.allPairs.slice(0, this.initialLoadCount);
            }
        }
    }
}
