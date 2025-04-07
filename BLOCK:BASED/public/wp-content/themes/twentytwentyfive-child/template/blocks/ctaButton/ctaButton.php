<?php
$block_name = "cta-button";
$label = get_field('label');
$align = get_field('alignment');
?>
<div class=<?php echo $block_name . "-" . $align ?>>
    <div class="<?php echo $block_name; ?>">
        <?php echo $label; ?>
    </div>
</div>
<style>
    .<?php echo $block_name ?> {
        padding: 5px 10px;
        border-radius: 5px;
        color: #ffffff;
        font-weight: bold;
        background-color: #db2777;
        width: max-content;
        display: inline-block;
    }

    .<?php echo $block_name . "-center" ?> {
        text-align: center;
    }

    .<?php echo $block_name . "-right" ?> {
        text-align: right;
    }
</style>