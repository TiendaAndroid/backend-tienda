import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'

@Entity( { name: 'product_images' } )
export class ProductImage {
    @PrimaryGeneratedColumn( 'rowid' )
    id: number

    @Column( 'text' )
    url: string

    @ManyToOne(
        () => Product,
        product => product.image,
        { onDelete: 'CASCADE' }
    )
    product: Product
}